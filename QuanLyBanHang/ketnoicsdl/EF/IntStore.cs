namespace ketnoicsdl.EF
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class IntStore : DbContext
    {
        public IntStore()
            : base("name=IntStore")
        {
        }

        public virtual DbSet<Batch> Batches { get; set; }
        public virtual DbSet<Cart> Carts { get; set; }
        public virtual DbSet<CartDetail> CartDetails { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<CustomerCheckIn> CustomerCheckIns { get; set; }
        public virtual DbSet<CustomerPos> CustomerPos { get; set; }
        public virtual DbSet<Expression> Expressions { get; set; }
        public virtual DbSet<LogCustomer> LogCustomers { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Staf> Stafs { get; set; }
        public virtual DbSet<TypeProduct> TypeProducts { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Batch>()
                .Property(e => e.Producer)
                .IsUnicode(false);

            modelBuilder.Entity<Batch>()
                .Property(e => e.ShelvesDefault)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.EngName)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.UserName)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.ImgPath)
                .IsUnicode(false);

            modelBuilder.Entity<Customer>()
                .Property(e => e.Pass)
                .IsUnicode(false);

            modelBuilder.Entity<CustomerCheckIn>()
                .Property(e => e.Clothes)
                .IsUnicode(false);

            modelBuilder.Entity<CustomerPos>()
                .Property(e => e.ShelvesID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Expression>()
                .Property(e => e.EngName)
                .IsUnicode(false);

            modelBuilder.Entity<Expression>()
                .Property(e => e.VieName)
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ProID)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Product>()
                .Property(e => e.ShelvesNow)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Staf>()
                .Property(e => e.UserName)
                .IsUnicode(false);

            modelBuilder.Entity<Staf>()
                .Property(e => e.Pass)
                .IsUnicode(false);
        }
    }
}
