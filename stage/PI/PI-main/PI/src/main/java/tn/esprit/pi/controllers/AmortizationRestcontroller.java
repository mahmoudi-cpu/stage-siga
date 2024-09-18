package tn.esprit.pi.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Amortization;
import tn.esprit.pi.services.IAmortizationService;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping("/amortization")
@SecurityRequirement(name = "bearerAuth")
public class AmortizationRestcontroller {

    IAmortizationService amortizationService;

    //Afficher
    @GetMapping("/retrieve_all_amortization")
    public List<Amortization> retrieveAllAmortization() {
        return amortizationService.retrieveAllAmortization();
    }

    // get by id
    @GetMapping("/retrieve_amortization/{idAmrt}")
    public Amortization retrieveAmortization(@PathVariable("idAmrt") Long idAmrt) {
        return amortizationService.retrieveAmortization(idAmrt);
    }

    @Secured({"ADMIN", "AGENT"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
    @PostMapping("/add-amortization-fees/{requestId}")
    public ResponseEntity<Amortization> addAmortizationFees(@PathVariable Long requestId, @RequestParam Long fees) {
        Amortization amortization = amortizationService.addAmortizationFees(requestId, fees);
        return ResponseEntity.ok(amortization);
    }


    // edit
    @Secured({"ADMIN", "AGENT"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
    @PutMapping("/modify-amortization")
    public Amortization modifyAmortization(@RequestBody Amortization amrt) {
        return amortizationService.modifyAmortization(amrt);
    }

    // delete
    @Secured({"ADMIN", "AGENT"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
    @DeleteMapping("/remove-amortization/{idAmrt}")
    public void removeAmortization(@PathVariable("idAmrt") Long idAmrt) {
        amortizationService.removeAmortization(idAmrt);
    }
/*
    @GetMapping("/calculate-remaining-balance/{idAmrt}/{periodsElapsed}")
    public ResponseEntity<Long> calculateRemainingBalance(@PathVariable Long idAmrt, @PathVariable Long periodsElapsed) {
        try {
            Long remainingBalance = amortizationService.calculateRemainingBalance(idAmrt, periodsElapsed);
            return new ResponseEntity<>(remainingBalance, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

 */
}