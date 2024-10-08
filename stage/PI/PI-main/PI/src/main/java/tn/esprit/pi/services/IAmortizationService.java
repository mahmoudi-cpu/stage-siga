package tn.esprit.pi.services;



import tn.esprit.pi.entities.Amortization;

import java.util.List;

public interface IAmortizationService {
    public List<Amortization> retrieveAllAmortization();
    public Amortization retrieveAmortization(Long idAmt);
    public Amortization modifyAmortization (Amortization amrt);
    public void removeAmortization (Long idAmt);
    public Amortization addAmortizationFees(Long requestId, Long fees);

    //public Long calculateRemainingBalance(Long idAmrt, Long periodsElapsed);

    /*
    method wassim:
     void pret(Integer userId, Float amount, Integer investmentPeriodInMonths);

    @Transactional
        @Scheduled(fixedDelay = 86400000)
    void checkPret();
     */

}
