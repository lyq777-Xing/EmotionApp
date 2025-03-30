using Microsoft.AspNetCore.Authorization;

/**
 * 
 */
public class CustomRequirement : IAuthorizationRequirement
{
    public string RequiredRole { get; }

    public CustomRequirement(string requiredRole)
    {
        RequiredRole = requiredRole;
    }
}
