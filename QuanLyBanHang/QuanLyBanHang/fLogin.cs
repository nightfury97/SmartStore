using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ketnoicsdl.Services.Services;
using ketnoicsdl.EF;

namespace QuanLyBanHang
{
    public partial class fLogin : Form
    {

        public fLogin()
        {
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            string pass = txbPassword.Text.ToString();
            string username = txbUsername.Text.ToString();
            int count = new F_Staf().Count(x => x.UserName == username);
            if(count==1)
            {
                string p = new F_Staf().GetSingleByCondition(x => x.UserName == username).Pass;
                if (pass == p)
                {
                    fTableManager f = new fTableManager();
                    this.Hide();
                    f.ShowDialog();
                    this.Show();
                    
                }
                else
                {
                    MessageBox.Show("Mật khẩu không chính xác!", "Thông báo", MessageBoxButtons.OK);
                }                
            }
            else
            {
                MessageBox.Show("Tên đăng nhập không tồn tại!", "Thông báo", MessageBoxButtons.OK);
            }
            
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void fLogin_FormClosing(object sender, FormClosingEventArgs e)
        {
            if(MessageBox.Show("Bạn có thật sự muốn thoát chương trình?","Thông báo", MessageBoxButtons.OKCancel) != System.Windows.Forms.DialogResult.OK)
            {
                e.Cancel = true;
            }
        }

        private void fLogin_Load(object sender, EventArgs e)
        {

        }
    }
}
