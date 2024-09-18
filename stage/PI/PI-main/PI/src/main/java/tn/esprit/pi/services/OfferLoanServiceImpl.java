package tn.esprit.pi.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.OfferLoanRepository;
import tn.esprit.pi.repositories.RequestLoanRepository;
import tn.esprit.pi.repositories.UserRepository;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor// inject repo in service
public class OfferLoanServiceImpl implements  IOfferLoanService {

    OfferLoanRepository offerLoanRepo;
    RequestLoanRepository requestLoanRepo;
    UserRepository userRepository;
    private Role getCurrentUserRole(User user) {
        return user.getRole();
    }
    private final String TMM_URL = "https://www.stb.com.tn/fr/site/bourse-change/historique-des-tmm/";

    @Scheduled(cron = "0 0 9 1 * ?") // Run at 9 AM on the first day of every month
    public void updateTmmValues() {
        Double tmmValue = fetchLastTmmValue(TMM_URL);
        if (tmmValue != null) {
            List<OfferLoan> offerLoans = offerLoanRepo.findAll();
            for (OfferLoan offerLoan : offerLoans) {
                offerLoan.setTmm(tmmValue);
                offerLoanRepo.save(offerLoan);
            }
            log.info("TMM values updated successfully for {} offer loans.", offerLoans.size());
        } else {
            log.error("Failed to fetch TMM value. Updating TMM values aborted.");
        }
    }
    public Double fetchLastTmmValue(String url) {
        Double lastTmmValue = null;
        try {
            final Document doc = Jsoup.connect(url).get();
            for (Element row : doc.select("table.cours-de-change tr")) {
                if (row.select("td:nth-of-type(1)").text().equals("")) {
                    continue;
                } else {
                    final String rate = row.select("td:nth-of-type(3)").text();
                    lastTmmValue = Double.parseDouble(rate);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching TMM values: {}", e.getMessage());
        }
        return lastTmmValue;
    }
    public List<OfferLoan> retrieveAllOfferLoans() {
        return offerLoanRepo.findAll();
    }

    public OfferLoan retrieveOfferLoan(Long idOffer) {
        return offerLoanRepo.findById(idOffer).get();
    }

    public OfferLoan addOfferLoan(OfferLoan offer, User user) {
        Role userRole = getCurrentUserRole(user);

        if (!Arrays.asList(Role.ADMIN, Role.AGENT).contains(userRole)) {
            throw new AccessDeniedException("You're not authorized to add an offer");
        }
        Double lastTmmValue = fetchLastTmmValue("https://www.stb.com.tn/fr/site/bourse-change/historique-des-tmm/");
        offer.setTmm(lastTmmValue);

        offer.setUser(user);
        return offerLoanRepo.save(offer);
    }

    public OfferLoan modifyOfferLoan(OfferLoan offer, User user) {
        Role userRole = getCurrentUserRole(user);
        if (!Arrays.asList(Role.ADMIN, Role.AGENT).contains(userRole)) {
            throw new AccessDeniedException("You're not authorized to add an offer");
        }
        offer.setUser(user);
        return offerLoanRepo.save(offer);
    }

    public void removeOfferLoan(Long idOffer, User user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("Only admins are authorized to delete offers.");
        }
        offerLoanRepo.deleteById(idOffer);
    }

    public float simulationCalMonthlyRepaymentAmount(Long offerId, Long loanAmnt, Long nbrMonth) {
        OfferLoan offer = offerLoanRepo.findById(offerId).get();
        LoanType loanType = offer.getTypeLoan();
        if (loanType == LoanType.STUDENT || loanType == LoanType.FARMER || loanType == LoanType.HOMEMAKER) {
            float intRate = offer.getIntRate();
            float annualIntRate = intRate / 100;
            float monthlyIntRate= annualIntRate/12;
            return (float) ((loanAmnt * monthlyIntRate) / (1 - Math.pow(1 + monthlyIntRate, -nbrMonth*12)));
        } else {
            throw new IllegalArgumentException("Constant Monthly repayment calculation is only applicable for LoanType STUDENT, FARMER, or HOMEMAKER.");
        }
    }

    public float simulationCalYearlyRepaymentAmount(Long offerId, Long loanAmnt, Long nbrYears, typeAmort type) {
        OfferLoan offer = offerLoanRepo.findById(offerId).get();

        if (offer.getTypeLoan() != LoanType.PROJECT) {
            throw new IllegalArgumentException("Yearly repayment calculation is only applicable for LoanType PROJECT.");
        }
        float intRate = offer.getIntRate();
        float annualRate = intRate / 100;
        switch (type) {
            case CONST_ANNUITY:
                return (float) ((loanAmnt * annualRate) / (1 - Math.pow(1 + annualRate, -nbrYears)));
            case CONST_AMORTIZATION:
                float amort = loanAmnt / nbrYears;
                float interest = loanAmnt * annualRate;
                return amort + interest;
            case LOAN_PER_BLOC:
                float sumInterest = 0;
                for (int i = 0; i < nbrYears; i++) {
                    sumInterest += loanAmnt * annualRate;
                }
                float totalAmount = loanAmnt + sumInterest;
                return totalAmount;
            default:
                throw new IllegalArgumentException("Unsupported amortization type: " + type);
        }
    }
    //search and display offers that the minAmount is greater than the searchedAmount
    public List<OfferLoan> findOffersByMinAmntLessThanEqual(Long searchedAmount) {
        return offerLoanRepo.findOffersByMinAmntLessThanEqual(searchedAmount);
    }

    //count the number of offers available
    public int countAvailableOffers() {
        return offerLoanRepo.countByStatus("AVAILABLE");
    }

    public int countRequestLoansByOfferId(Long offerId) {
        return offerLoanRepo.countRequestLoansByOfferId(offerId);
    }


}


    /*
    // Assign + unassign child to/from parent:
    public void unassignRequestFromOffer(Long idOffr, Long idReqt) {
        OfferLoan offerLoan = offerLoanRepo.findById(idOffr).get();//parent
        RequestLoan requestLoan = requestLoanRepo.findById(idReqt).get();//child
        offerLoan.getRequestloans().remove(requestLoan);
        offerLoanRepo.save(offerLoan);
    }
*/
//  @Scheduled(cron = "0 */5 * * * *")
    /*public void scheduledFetchAndUpdateTmmValue() {
        fetchAndUpdateTmmValue();


*/


