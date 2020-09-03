namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("CustomerCheckIn")]
    public partial class CustomerCheckIn
    {
        [Key]
        public int No { get; set; }

        public int? CusId { get; set; }

        [StringLength(100)]
        public string Clothes { get; set; }

        public int? Expression { get; set; }

        public int? Age { get; set; }

        public DateTime? CheckInTime { get; set; }

        public DateTime? CheckOutTime { get; set; }
    }
}
