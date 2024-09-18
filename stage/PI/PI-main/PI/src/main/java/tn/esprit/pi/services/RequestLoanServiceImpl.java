package tn.esprit.pi.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.AmortizationRepository;
import tn.esprit.pi.repositories.OfferLoanRepository;
import tn.esprit.pi.repositories.RequestLoanRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor// inject repo in service
public class RequestLoanServiceImpl implements IRequestLoanService {

    RequestLoanRepository requestLoanRepo;
    OfferLoanRepository offerLoanRepo;
    AmortizationRepository amortizationRepos;
    OfferLoanServiceImpl offerLoanService;
    TwilioService twilioService;
    //TransactionService transactionService;

    private Role getCurrentUserRole(User user) {
        return user.getRole();
    }

    @Secured({"ADMIN", "AGENT"})
    public List<RequestLoan> retrieveAllLoans() {
        return requestLoanRepo.findAll();
    }

    @Secured({"ADMIN", "CUSTOMER", "AGENT"})
    public RequestLoan retrieveLoan(Long idRequest) {
        return requestLoanRepo.findById(idRequest).get();
    }

    /*
    public  String uploadFile (MultipartFile file) throws IOException {
        RequestLoan requestLoan = requestLoanRepo.save(RequestLoan.builder()
                .fileName(file.getOriginalFilename())
                .garantorFile(file.getBytes()).build());
            if(requestLoan != null){
                return "file uploaded succesfully"+ file.getOriginalFilename();
            }
            return null;
    }

     */
    public RequestLoan addLoanAndAssignRequestToOffer(RequestLoan requestLoan, Long offerId, typeAmort type, MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Role userRole = getCurrentUserRole(currentUser);
        if (!Arrays.asList(Role.ADMIN, Role.AGENT, Role.CUSTOMER).contains(userRole)) {
            throw new AccessDeniedException("You're not authorized to add a loan.");
        }
        if (file != null && !file.isEmpty()) {
            requestLoan.setFileName(file.getOriginalFilename());
            requestLoan.setGarantorFile(file.getBytes());
        }
        OfferLoan offerLoan = offerLoanRepo.findById(offerId).get();
        if (offerLoan.getTypeLoan() == LoanType.STUDENT || offerLoan.getTypeLoan() == LoanType.FARMER || offerLoan.getTypeLoan() == LoanType.HOMEMAKER) {
            requestLoan.setTypeAmrt(typeAmort.CONST_MONTHLY);
        } else if (type == typeAmort.CONST_ANNUITY || type == typeAmort.CONST_AMORTIZATION || type == typeAmort.LOAN_PER_BLOC) {
            if (offerLoan.getTypeLoan() == LoanType.PROJECT) {
                requestLoan.setTypeAmrt(type);
            } else {
                throw new IllegalArgumentException("Unsupported amortization type for non-PROJECT loans.");
            }
        } else {
            throw new IllegalArgumentException("Unsupported amortization type: " + type);
        }
        requestLoan.setStatus(StatLoan.PENDING);
        requestLoan.setOfferLoan(offerLoan);
        return requestLoanRepo.save(requestLoan);
    }
    public RequestLoan modifyLoan(RequestLoan request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Role userRole = getCurrentUserRole(currentUser);
        if (!Arrays.asList(Role.ADMIN, Role.AGENT, Role.CUSTOMER).contains(userRole)) {
            throw new AccessDeniedException("You're not authorized to modify a loan.");
        }
        RequestLoan existingLoan = requestLoanRepo.findById(request.getRequestId()).get();
        OfferLoan offerLoan = existingLoan.getOfferLoan();
        request.setOfferLoan(offerLoan);
        return requestLoanRepo.save(request);
    }
    public void removeLoan(Long idRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Role userRole = getCurrentUserRole(currentUser);
        if (!Arrays.asList(Role.ADMIN, Role.AGENT, Role.CUSTOMER).contains(userRole)) {
            throw new AccessDeniedException("You're not authorized to add a loan.");
        }
        RequestLoan loan = requestLoanRepo.findById(idRequest).get();
        StatLoan loanStatus = loan.getStatus();
        if (loanStatus != StatLoan.PENDING && loanStatus != StatLoan.REJECTED) {
            throw new IllegalStateException("Loan cannot be removed because it is not in Approved status.");
        }

        requestLoanRepo.deleteById(idRequest);
    }

    //status
    public List<RequestLoan> findLoansByStatus(StatLoan status) {
        return requestLoanRepo.findByStatus(status);
    }

    public void rejectLoan(Long reqId, TwilioService twilioService) {
        RequestLoan requestLoan = requestLoanRepo.findById(reqId).get();
        if (requestLoan.getStatus() == StatLoan.PENDING) {
            requestLoan.setStatus(StatLoan.REJECTED);
           twilioService.sendSMS("+21696082716", "Sorry, but your loan has been rejected.");
            requestLoanRepo.save(requestLoan);
            log.info("Loan with ID {} has been rejected.", reqId);
        } else {
            throw new IllegalStateException("Cannot reject loan with ID " + reqId + ". It is not in PENDING status.");
        }
    }

    public void approveLoan(Long requestId) {
        RequestLoan requestLoan = requestLoanRepo.findById(requestId).get();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Role userRole = getCurrentUserRole(currentUser);
        if (!Arrays.asList(Role.ADMIN, Role.AGENT).contains(userRole)) {
            throw new AccessDeniedException("Only ADMIN or AGENT can approve loans.");
        }
        if (requestLoan.getStatus() != StatLoan.PENDING) {
            throw new IllegalStateException("Cannot approve loan with ID " + requestId + ". It is not in PENDING status.");
        }
        requestLoan.setStatus(StatLoan.APPROVED);

        Amortization amortization = addAmortization(requestLoan);
        requestLoan.setAmortization(amortization);

        requestLoanRepo.save(requestLoan);
    }

    private Amortization addAmortization(RequestLoan requestLoan) {
        Amortization amortization = new Amortization();
        amortization.setDate(new Date());
        long startAmount = requestLoan.getLoanAmnt().longValue();
        amortization.setStartAmount(startAmount);

        float intRate = requestLoan.getOfferLoan().getIntRate() / 100.0f;
        long periode;
        switch (requestLoan.getTypeAmrt()) {
            case CONST_MONTHLY:
                periode = requestLoan.getNbrMonth();
                amortization.setPeriode(periode);
                float monthlyIntRate = intRate / 12.0f;
                long annuityMonthly = (long) ((startAmount * monthlyIntRate) / (1 - Math.pow(1 + monthlyIntRate, -periode)));
                amortization.setAnnuity(annuityMonthly);
                long amrtMonthly = annuityMonthly * (periode);
                amortization.setAmrt(amrtMonthly);
                long interestMonthly = amrtMonthly - startAmount;
                amortization.setIntrest(interestMonthly);
                break;

            case CONST_ANNUITY:
                periode = requestLoan.getNbrYears();
                amortization.setPeriode(periode);
                long interestAnnuity = (long) (startAmount * intRate);
                amortization.setIntrest(interestAnnuity);
                float annualRate = intRate / 100;
                long annuityAnnuity = (long) ((startAmount * annualRate) / (1 - Math.pow(1 + annualRate, -periode)));
                amortization.setAnnuity(annuityAnnuity);
                long amrtAnnuity = annuityAnnuity - interestAnnuity;
                amortization.setAmrt(amrtAnnuity);
                break;

            case CONST_AMORTIZATION:
                periode = requestLoan.getNbrYears();
                amortization.setPeriode(periode);
                long amrtAmortization = startAmount / periode;
                amortization.setAmrt(amrtAmortization);
                long interestAmortization = (long) (startAmount * intRate);
                amortization.setIntrest(interestAmortization);
                float annuityAmortization = amrtAmortization + interestAmortization;
                amortization.setAnnuity((long) annuityAmortization);
                break;

            case LOAN_PER_BLOC:
                periode = requestLoan.getNbrYears();
                amortization.setPeriode(periode);
                long amrtBloc = 0;
                amortization.setAmrt(amrtBloc);
                long interestBloc = (long) (startAmount * intRate);
                amortization.setIntrest(interestBloc);
                amortization.setAnnuity(interestBloc);
                break;

            default:
                throw new IllegalArgumentException("Unsupported amortization type: " + requestLoan.getTypeAmrt());
        }

        return amortization;
    }




    public void unassignAmortizationFromRequest(Long idReqt) {
        RequestLoan requestLoan = requestLoanRepo.findById(idReqt).get();
        requestLoan.setAmortization(null);
        requestLoanRepo.save(requestLoan);
    }

    public List<RequestLoan> retrieveAllLoansWithAmortization() {
        return requestLoanRepo.findAllByAmortizationIsNotNull();
    }

/*
    public List<RequestLoan> filterLoanApi(String keyword) {
        return requestLoanRepo.findByKeyword(keyword);
    }

     public List<RequestLoan> sortLoanApi(String sortBy) {
        Sort sort = Sort.by(sortBy).descending();
        return requestLoanRepo.findAllByOrderByFieldAsc(sortBy);
    }

 */
/*
    @Transactional
    @Scheduled(fixedDelay = 86400000)
    public void checkLoan() {
        List<RequestLoan> expiredLoans = requestLoanRepo.findByDatefinBefore(new Date());
        for (RequestLoan loan : expiredLoans) {
            transactionService.withdraw(1, loan.getLoanAmnt(), loan.getOfferLoan().getUser().getId_user(), Type_transaction.RETURN);
            transactionService.withdraw(1, loan.getOfferLoan().getIntRate(), loan.getOfferLoan().getUser().getId_user(), Type_transaction.INTEREST);
        }
    }

 */

}








