package tn.esprit.pi.services;


import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Role;
import tn.esprit.pi.entities.Transaction;
import tn.esprit.pi.entities.Type_transaction;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.IInvestmentRepository;
import tn.esprit.pi.repositories.ITransactionRepository;
import tn.esprit.pi.repositories.UserRepository;


import java.util.Calendar;
import java.util.List;


@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService{
   // private EmailSenderService emailSenderService;
    private ITransactionRepository ItransactionRepository;
    private UserRepository userRepository;
    private IInvestmentRepository iinvestmentRepository;
    @Override
    public List<Transaction> retrieveAllTransactions(){
        return ItransactionRepository.findAll();
    }

    public Transaction AddTransaction(Transaction transaction){
        return  ItransactionRepository.save(transaction);
    }
    @Override
   public void removeTransaction(Integer numTransaction){
        ItransactionRepository.deleteById(numTransaction);
   }
   @Override
    public Transaction retrieveTransaction(Integer numTransaction){
        return ItransactionRepository.findById(numTransaction).orElse(null);
    }

    public Transaction updateTransaction(Transaction transaction){
        return ItransactionRepository.save(transaction);
    }


   @Override
   public void assignTransactionToUser(Integer userId, Integer transactionId) {
       User user = userRepository.findById(userId).orElse(null);
       if (user == null) {
           throw new IllegalArgumentException("User not found with ID: " + userId);
       }

       Transaction transaction = ItransactionRepository.findById(transactionId).orElse(null);
       if (transaction == null) {
           throw new IllegalArgumentException("Transaction not found with ID: " + transactionId);
       }

       transaction.setUser(user);
       ItransactionRepository.save(transaction);
   }
    @Override
    public Transaction withdraw(Integer userId, Float amount, Integer receiverId, Type_transaction type){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));


        Float userAmount = user.getAmount();
        Float recAmount=receiver.getAmount();
        if (user.getAmount() < amount) {
            throw new IllegalArgumentException("User does not have enough balance to make the transaction");
        }
        user.setAmount(userAmount - amount);

        receiver.setAmount(recAmount + amount);
        userRepository.save(receiver);
//        User admin = userRepository.findUserByRole(Role.Admin);
        User admin = (User) userRepository.findUserByRole(Role.ADMIN);

        if (admin == null) {
            throw new EntityNotFoundException("Admin user not found");
        }
        Float transactionFee = calculateTransactionFee(amount);
        user.setAmount(user.getAmount() - transactionFee);

        Float adminAmount = admin.getAmount();
        admin.setAmount(adminAmount + transactionFee);

        userRepository.save(admin);


        Transaction transaction= new Transaction();

        transaction.setDate_transaction(Calendar.getInstance().getTime());
        transaction.setValue(amount);
        transaction.setSender(userId);
        transaction.setReceiver(receiverId);
        transaction.setUser(user);
        transaction.setType(type);

        userRepository.save(user);
       /* if (transaction.getType()==Type_transaction.WITHDRAW){
            emailSenderService.sendTransactionEmail("samar.saidana@esprit.tn",user.getEmail_address(),transaction.getValue());
            emailSenderService.receiveTransactionEmail("samar.saidana@esprit.tn",receiver.getEmail_address(),transaction.getValue());
        } */
        return  ItransactionRepository.save(transaction);
    }
    private Float calculateTransactionFee(Float transactionAmount) {
        // Example fee calculation logic (you can adjust as needed)
        return transactionAmount * 0.05f; // Assuming 5% fee
    }
    @Override
    public Type_transaction testtr(Integer transactionId){
        Transaction transaction = ItransactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with id: " + transactionId));
        Type_transaction type = transaction.getType();
         return type;
    }

    public List<Transaction> findByType(Type_transaction type) {
        return ItransactionRepository.findByType(type);
    }

}
