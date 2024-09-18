package tn.esprit.pi.services;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pi.entities.RequestLoan;
import tn.esprit.pi.entities.StatLoan;
import tn.esprit.pi.entities.typeAmort;

import java.io.IOException;
import java.util.List;

public interface IRequestLoanService {
    //public  String uploadFile (MultipartFile file) throws IOException;
    public List<RequestLoan> retrieveAllLoans();
    public RequestLoan retrieveLoan(Long idRequest);
    public RequestLoan addLoanAndAssignRequestToOffer(RequestLoan requestLoan, Long offerId, typeAmort type, MultipartFile file) throws IOException;
    public RequestLoan modifyLoan (RequestLoan request);
    public void removeLoan(Long idRequest);

    public List<RequestLoan> findLoansByStatus(StatLoan status);
    public void approveLoan(Long requestId);
    public void rejectLoan(Long reqId, TwilioService twilioService);
    //Assign + unassign child to/from parent
    public void unassignAmortizationFromRequest (Long idReqt);
    public List<RequestLoan> retrieveAllLoansWithAmortization();

    //public List<RequestLoan> searchFilterLoanApi(String keyword);
    //public List<RequestLoan> searchSortLoanApi(String sortBy);

}

