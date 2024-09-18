package tn.esprit.pi.entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
@Getter
@Setter
@Slf4j
@AllArgsConstructor
@Data
public class SMSSendRequest {
 private String destnationSMSNumber;
 private String smsMessage;}
