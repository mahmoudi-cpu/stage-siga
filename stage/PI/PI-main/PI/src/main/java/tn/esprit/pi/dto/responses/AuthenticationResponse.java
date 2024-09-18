package tn.esprit.pi.dto.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import tn.esprit.pi.entities.User;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private User user;

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;
}
