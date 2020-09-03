namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Cart")]
    public partial class Cart
    {
        [Key]
        public int No { get; set; }

        public int? CusId { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public double? Total { get; set; }
    }
}
