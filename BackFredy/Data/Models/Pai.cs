using System;
using System.Collections.Generic;

namespace Data.Models
{
    public partial class Pai
    {
        public Pai()
        {
            Tableros = new HashSet<Tablero>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; } = null!;

        public virtual ICollection<Tablero> Tableros { get; set; }
    }
}
