using System.Security.Claims;

public interface ITokenService
{
    string GenerateToken(IEnumerable<Claim> claims);

    ClaimsPrincipal ValidateToken(string token);
}
