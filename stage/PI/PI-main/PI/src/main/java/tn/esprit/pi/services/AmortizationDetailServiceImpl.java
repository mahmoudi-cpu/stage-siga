package tn.esprit.pi.services;

import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.*;
import tn.esprit.pi.repositories.AmortizationDetailsRepository;
import tn.esprit.pi.repositories.AmortizationRepository;

import java.util.Arrays;
import java.util.List;


@Service
@AllArgsConstructor
public class AmortizationDetailServiceImpl implements  IAmortizationDetailService{

    AmortizationDetailsRepository amortizationdetailRepo;
    AmortizationRepository amortRepo;

    private Role getCurrentUserRole(User user) {
        return user.getRole();
    }

    public List<AmortizationDetail> retrieveAllDetail() {
        return amortizationdetailRepo.findAll();
    }
    public AmortizationDetail retrieveAmortizationDetail(Long idAmrt) {
        return amortizationdetailRepo.findById(idAmrt).get();
    }


    public Amortization addAmortizationDetail(AmortizationDetail detail, Long idAmrt){

        Amortization amort = amortRepo.findById(idAmrt).get();
        detail.setAmortization(amort);
        return amortizationdetailRepo.save(detail).getAmortization();
    }



}
