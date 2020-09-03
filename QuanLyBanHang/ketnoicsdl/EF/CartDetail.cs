namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("CartDetail")]
    public partial class CartDetail
    {
        [Key]
        public int No { get; set; }

        public int? NoCart { get; set; }

        public int? BatchNumber { get; set; }

        public int? Quantity { get; set; }
    }
}
