package tn.esprit.pi.services;



import tn.esprit.pi.entities.Amortization;
import tn.esprit.pi.entities.AmortizationDetail;
import tn.esprit.pi.entities.OfferLoan;
import tn.esprit.pi.entities.User;

import java.util.List;

public interface IAmortizationDetailService {
    public List<AmortizationDetail> retrieveAllDetail();
    public AmortizationDetail retrieveAmortizationDetail(Long idAmt);
    public Amortization addAmortizationDetail(AmortizationDetail detail, Long amrt);

}
