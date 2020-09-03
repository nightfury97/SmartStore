using ketnoicsdl.EF;

namespace ketnoicsdl.Services.Infrastructure
{
    public class DbFactory : IDbFactory
    {
        private IntStore dbContext;

        public void Dispose()
        {
            if (dbContext != null)
                dbContext.Dispose();
        }

        public IntStore Init()
        {
            return dbContext ?? (dbContext = new IntStore());
        }
    }
}