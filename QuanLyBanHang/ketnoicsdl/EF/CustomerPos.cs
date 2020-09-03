namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CustomerPos
    {
        [Key]
        public int No { get; set; }

        public int? CheckInNo { get; set; }

        public int? CusId { get; set; }

        public DateTime? Time { get; set; }

        [StringLength(4)]
        public string ShelvesID { get; set; }
    }
}
