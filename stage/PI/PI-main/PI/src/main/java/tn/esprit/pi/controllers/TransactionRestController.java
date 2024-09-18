package tn.esprit.pi.controllers;





import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.entities.Transaction;
import tn.esprit.pi.entities.Type_transaction;
import tn.esprit.pi.services.TransactionService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Transaction")
@SecurityRequirement(name = "bearerAuth")
public  class TransactionRestController {
    private TransactionService transactionService;

    @PostMapping("/add")
    Transaction AddTransaction(@RequestBody Transaction transaction){
        return transactionService.AddTransaction(transaction);
    }
    @GetMapping("/all")
    List<Transaction> retrieveAllTransactions(){
        return  transactionService.retrieveAllTransactions();
    }
    @GetMapping("/get/{id}")
    Transaction retrieveTransaction(@PathVariable("id") Integer id_transaction){
        return transactionService.retrieveTransaction(id_transaction);
    }
    @DeleteMapping("/delete/{id}")
    void removeTransaction(@PathVariable("id") Integer id_transaction){
        transactionService.removeTransaction(id_transaction);
    }
    @PutMapping("/update")
    Transaction updateTransaction(@RequestBody Transaction transaction){
        return transactionService.updateTransaction(transaction);
    }

@PutMapping("/assignTrtoUser/{id_user}/{id_transaction}")
    public void assignTransactionToUser(@PathVariable Integer id_transaction, @PathVariable Integer id_user){
        transactionService.assignTransactionToUser(id_transaction,id_user);
    }
    @PostMapping("/withdraw/{user_id}/{rece_id}/{amount}/{type}")
    public Transaction withdraw(@PathVariable("user_id") Integer userId,
                                @PathVariable("amount") Float amount,
                                @PathVariable("rece_id") Integer receiverId,@PathVariable("type") Type_transaction type) {
        return transactionService.withdraw(userId, amount, receiverId,type);
    }
  @GetMapping("/testtype/{id_transaction}")

  public Type_transaction testtr(@PathVariable("trans_id") Integer transactionId){
        return transactionService.testtr(transactionId);
  }
}
