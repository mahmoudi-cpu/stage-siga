package tn.esprit.pi.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.RequestLoan;
import tn.esprit.pi.entities.StatLoan;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.entities.typeAmort;
import tn.esprit.pi.services.IRequestLoanService;
import tn.esprit.pi.services.TwilioService;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@CrossOrigin("*")
@RequestMapping("/request_loan")
@SecurityRequirement(name = "bearerAuth")
public class RequestLoanRestcontroller {

    IRequestLoanService requestLoanService;
    TwilioService twilioService;


//Afficher
    @GetMapping("/retrieve_All_request")
    //@Secured({"ADMIN", "AGENT"})
    public ResponseEntity<List<RequestLoan>> retrieveAllLoans() {
        List<RequestLoan> loans = requestLoanService.retrieveAllLoans();
        return new ResponseEntity<>(loans, HttpStatus.OK);
    }

// get by id
    @GetMapping("/retrieve_request/{idReq}")
    public RequestLoan retrieveLoan (@PathVariable("idReq") Long idOff) {
        return requestLoanService.retrieveLoan(idOff);
    }

// add
    @PostMapping("/add-loan-and-assign-to-offer/{offerId}/{type}")
    public ResponseEntity<RequestLoan> addLoanAndAssignRequestToOffer(@PathVariable Long offerId,
                                                      @PathVariable typeAmort type,
                                                      @RequestParam("file") MultipartFile file,
                                                      @RequestBody RequestLoan requestLoan) throws IOException {
        RequestLoan savedRequestLoan = requestLoanService.addLoanAndAssignRequestToOffer(requestLoan, offerId, type, file);
        return ResponseEntity.ok(savedRequestLoan);
    }
    /*
    @PostMapping("/uploadFile")
    public ResponseEntity<?> uploadFile(@RequestParam("file")
                                        MultipartFile file) throws IOException {
        String uploadFile = requestLoanService.uploadFile(file);
        return ResponseEntity.status(HttpStatus.OK).body(uploadFile);
    }

     */
// edit
    @PutMapping("/modify-loan")
    public ResponseEntity<RequestLoan> modifyLoan(@RequestBody RequestLoan request) {
        try {
            RequestLoan modifiedLoan = requestLoanService.modifyLoan(request);
            return ResponseEntity.ok(modifiedLoan);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
// delete
    @DeleteMapping("/remove-loan/{idReq}")
    public void removeRequestLoan(@PathVariable("idReq") Long idReq) {
        requestLoanService.removeLoan(idReq);
    }

//afficher status loan
    @GetMapping("/find_by_status")
    public List<RequestLoan> findLoansByStatus(@RequestParam("status") StatLoan status) {
        return requestLoanService.findLoansByStatus(status);
    }

    @Secured({"ADMIN", "AGENT"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
    @PutMapping("/reject_req/{requestId}")
    public ResponseEntity<String> rejectLoan(@PathVariable("requestId") Long reqId) {
        requestLoanService.rejectLoan(reqId,twilioService);
        twilioService.sendSMS("+21696082716", "Your loan request has been rejected.");
        return ResponseEntity.ok("Loan with ID " + reqId + " has been rejected.");
    }

    @Secured({"ADMIN", "AGENT"})
    @PreAuthorize("hasAnyAuthority('ADMIN', 'AGENT')")
    @PutMapping("/approve/{requestId}")
    public ResponseEntity<String> approveLoan(@PathVariable Long requestId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        requestLoanService.approveLoan(requestId);
        return ResponseEntity.ok("Loan with ID " + requestId + " has been approved.");
    }

    @PutMapping("/unaffecter-request-from-amortization/{request-id}")
    public void unassignAmortizationFromRequest(@PathVariable("request-id") Long reqtId ) {
        requestLoanService.unassignAmortizationFromRequest(reqtId);
    }
    @GetMapping("/loans-with-amortization")
    public ResponseEntity<List<RequestLoan>> retrieveAllLoansWithAmortization() {
        List<RequestLoan> loans = requestLoanService.retrieveAllLoansWithAmortization();
        if (loans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(loans);
    }




    /*
    @GetMapping("/search")
    public ResponseEntity<List<RequestLoan>> searchFilterLoanApi(@RequestParam(required = false) String keyword) {
        List<RequestLoan> loans = requestLoanService.searchFilterLoanApi(keyword);
        return ResponseEntity.ok(loans);
    }


------------
kifeh torbet l invest bel transaction:
transaction.setType(Type_transaction.INVESTMENT); // Use the enum value
// Set other transaction details as needed
    transaction.setUser(user); // Set the user associated with the investment
// Set other fields as needed
    transactionRepository.save(transaction);
 */


}
