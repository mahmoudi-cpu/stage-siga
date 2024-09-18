package tn.esprit.pi.services;



import tn.esprit.pi.entities.OfferLoan;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.entities.typeAmort;

import java.util.List;

public interface IOfferLoanService {

    public List<OfferLoan> retrieveAllOfferLoans();
    public OfferLoan retrieveOfferLoan(Long idOffer);
    public OfferLoan addOfferLoan (OfferLoan o, User user);
    public OfferLoan modifyOfferLoan(OfferLoan offer, User user);
    public void removeOfferLoan(Long idOffer, User user);
    public List<OfferLoan> findOffersByMinAmntLessThanEqual(Long searchedAmount);
    public int countAvailableOffers();
    public int countRequestLoansByOfferId(Long offerId);
    public float simulationCalMonthlyRepaymentAmount(Long offerId, Long loanAmnt, Long nbrMonth);
    public float simulationCalYearlyRepaymentAmount(Long offerId, Long loanAmnt, Long nbrYears, typeAmort type);
    public Double fetchLastTmmValue(String url);

    //public float fetchAndUpdateTmmValue() throws IOException;
    // public void unassignRequestFromOffer (Long idOffr, Long idReqt);




}
