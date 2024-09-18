package tn.esprit.pi.services;


import tn.esprit.pi.entities.Transaction;
import tn.esprit.pi.entities.Type_transaction;

import java.util.List;

public interface TransactionService {
    List<Transaction> retrieveAllTransactions();
    Transaction AddTransaction(Transaction transaction);
    void removeTransaction(Integer numTransaction);
    Transaction retrieveTransaction(Integer numTransaction);
    Transaction updateTransaction(Transaction transaction);


    void assignTransactionToUser(Integer id_transaction, Integer id_user);

    Transaction withdraw(Integer userId, Float amount, Integer receiverId, Type_transaction type);


    Type_transaction testtr(Integer transactionId);

    List<Transaction> findByType(Type_transaction type);

   // List<Transaction> findByInvestment(Investment investment);
}
