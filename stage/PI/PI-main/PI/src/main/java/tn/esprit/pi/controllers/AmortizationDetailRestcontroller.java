package tn.esprit.pi.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Amortization;
import tn.esprit.pi.entities.AmortizationDetail;
import tn.esprit.pi.services.IAmortizationDetailService;
import tn.esprit.pi.services.IAmortizationService;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping("/amortizationDetail")
@SecurityRequirement(name = "bearerAuth")
public class AmortizationDetailRestcontroller {

    IAmortizationDetailService amortizationDetailService;

    //Afficher
    @GetMapping("/retrieve_all_details_amortization")
    public List<AmortizationDetail> retrieveAllDetail() {
        return amortizationDetailService.retrieveAllDetail();
    }

    // get by id
    @GetMapping("/retrieve_amortization/{idAmrt}")
    public AmortizationDetail retrieveAmortization(@PathVariable("idAmrt") Long idAmrt) {
        return amortizationDetailService.retrieveAmortizationDetail(idAmrt);
    }

    @PostMapping("/add-amortization-fees/{requestId}")
    public ResponseEntity<Amortization> addAmortizationFees(@PathVariable AmortizationDetail detail,
                                                            @RequestParam Long idAmort) {
        Amortization amortization = amortizationDetailService.addAmortizationDetail(detail, idAmort);
        return ResponseEntity.ok(amortization);
    }


}