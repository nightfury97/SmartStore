using ketnoicsdl.EF;
using System;

namespace ketnoicsdl.Services.Infrastructure
{
    public interface IDbFactory : IDisposable
    {
        IntStore Init();
    }
}