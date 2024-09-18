package tn.esprit.pi.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class EmailSenderService {

    private JavaMailSender mailSender;


    public void sendEmail(String recipientEmail, String subject, String message) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("sarah.bouallegue@esprit.tn");
        helper.setTo(recipientEmail);
        helper.setSubject(subject);
        helper.setText(message);

        mailSender.send(mimeMessage);
    }


    public void sendMembershipValidationEmail(String email, String subject, String message) throws MessagingException {
        // Utilisez la méthode sendEmail pour envoyer l'e-mail
        sendEmail(email, subject, message);
    }

}