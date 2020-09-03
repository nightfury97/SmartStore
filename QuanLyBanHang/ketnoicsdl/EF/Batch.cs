namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Batch")]
    public partial class Batch
    {
        [Key]
        public int BatchNumber { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        public int? TypeID { get; set; }

        [StringLength(40)]
        public string Producer { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DoI { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DoM { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DoE { get; set; }

        public int? Amount { get; set; }

        public int? Price { get; set; }

        [StringLength(4)]
        public string ShelvesDefault { get; set; }

        [StringLength(50)]
        public string Unit { get; set; }
    }
}
