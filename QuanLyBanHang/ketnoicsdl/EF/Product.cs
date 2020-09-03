namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Product")]
    public partial class Product
    {
        [Key]
        [StringLength(8)]
        public string ProID { get; set; }

        public int? BatchNumber { get; set; }

        [StringLength(4)]
        public string ShelvesNow { get; set; }

        public int? Sold { get; set; }
    }
}
