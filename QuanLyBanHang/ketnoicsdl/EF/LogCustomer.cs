namespace ketnoicsdl.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("LogCustomer")]
    public partial class LogCustomer
    {
        public int ID { get; set; }

        public int? CusID { get; set; }

        public int? ProID { get; set; }

        public int? Type { get; set; }

        public int? Expression { get; set; }
    }
}
