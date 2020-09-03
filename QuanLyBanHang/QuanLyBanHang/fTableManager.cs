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
//using System.Net.Mqtt;

using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace QuanLyBanHang
{
    public partial class fTableManager : Form
    {
        IntStore db = new IntStore();
        MqttClient client;
        string clientId;


        public fTableManager()
        {
            InitializeComponent();
            cmbLoaihanghoa.DataSource = new F_TypeProduct().GetAll().ToList();
            cmbLoaihanghoa.DisplayMember = "Name";
            //string BrokerAddress = "192.168.43.250:1883";

            client = new MqttClient("192.168.43.250");

            // register a callback-function (we have to implement, see below) which is called by the library when a message was received
            client.MqttMsgPublishReceived += client_MqttMsgPublishReceived;

            // use a unique id as client id, each time we start the application
            clientId = Guid.NewGuid().ToString();

            client.Connect(clientId);

            // subscribe to the topic with QoS 2
            client.Subscribe(new string[] { "checkin" }, new byte[] { 2 });   // we need arrays as parameters because we can subscribe to different topics with one call
            client.Subscribe(new string[] { "cusPos" }, new byte[] { 2 });   // we need arrays as parameters because we can subscribe to different topics with one call
            client.Subscribe(new string[] { "checkout" }, new byte[] { 2 });   // we need arrays as parameters because we can subscribe to different topics with one call
        }

        delegate void SetTextCallback(string text);
        #region MQTT
        // this code runs when a message was received
        private void SetText(string text)
        {
            // InvokeRequired required compares the thread ID of the
            // calling thread to the thread ID of the creating thread.
            // If these threads are different, it returns true.
            if (this.dgvKhachhang.InvokeRequired)
            {
                SetTextCallback d = new SetTextCallback(SetText);
                this.Invoke(d, new object[] { text });
            }
            else
            {
                var cmd = db.Database.Connection.CreateCommand();
                cmd.CommandText = "SELECT * from [dbo].[GetCustomers]()";
                var table = new DataTable();
                cmd.Connection.Open();
                table.Load(cmd.ExecuteReader());
                dgvKhachhang.DataSource = table;
                cmd.Connection.Close();
                foreach (DataGridViewRow Myrow in dgvKhachhang.Rows)
                {            //Here 2 cell is target value and 1 cell is Volume
                    if (Myrow.Cells[3].Value.ToString() == "Buon")// Or your condition 
                    {
                        Myrow.DefaultCellStyle.BackColor = Color.YellowGreen;
                    }
                    if (Myrow.Cells[3].Value.ToString() == "Tuc gian")// Or your condition 
                    {
                        Myrow.DefaultCellStyle.BackColor = Color.Red;
                    }
                    if (Myrow.Cells[3].Value.ToString() == "Vui")// Or your condition 
                    {
                        Myrow.DefaultCellStyle.BackColor = Color.Aqua;
                    }
                }
            }
        }
        void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            string ReceivedMessage = Encoding.UTF8.GetString(e.Message);

            SetText(ReceivedMessage);
            //MessageBox.Show(ReceivedMessage);
            //Dispatcher.Invoke(delegate
            //{              // we need this construction because the receiving code in the library and the UI with textbox run on different threads
            //    mqtt.Text = ReceivedMessage;
            //});
        }

        ////// this code runs when the button "Publish" is clicked
        //protected void btnPublish_Click(object sender, RoutedEventArgs e)
        //{
            
        //}

        #endregion
        protected override void OnClosed(EventArgs e)
        {
            client.Disconnect();

            base.OnClosed(e);
            
        }
        private void tabPage1_Click(object sender, EventArgs e)
        {

        }

        private void cmbLoaihanghoa_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cmbLoaihanghoa.SelectedValue != null)
            {
                TypeProduct lhh = (TypeProduct)cmbLoaihanghoa.SelectedValue;
                dgvMathang.DataSource = new F_Batch().GetMulti(x => x.TypeID == lhh.ID).Select(o => new { mavach = o.BatchNumber, ten = o.Name }).ToList();

                List<Batch> lpd = new F_Batch().GetMulti(x => x.TypeID == lhh.ID && x.Amount > 0).ToList();
                
            }
            
        }
        Control GetControlByName(string Name)
        {
            foreach (Control c in panel7.Controls)
                if (c.Name == Name)
                    return c;

            return null;
        }

        private void dgvMathang_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            int BatchNumber = Int16.Parse(dgvMathang.Rows[e.RowIndex].Cells[0].Value.ToString());
            Batch mh = new F_Batch().GetSingleByCondition(x => x.BatchNumber == BatchNumber);
            txbTenmathang.Text = mh.Name;
            txbMavach.Text = mh.BatchNumber.ToString();
            //txbDonvi.Text = (mh.donvi != null) ? mh.donvi : "";
            txbGiaban.Text = (mh.Price != null) ? mh.Price.ToString() : "";
            txbHansudung.Text = (mh.DoE != null) ? mh.DoE.ToString() : "";
            txbNgaysanxuat.Text = (mh.DoM != null) ? mh.DoM.ToString() : "";
            //txbLohang.Text = (mh.lohang != null) ? mh.lohang.ToString() : "";
            txbVitrichuan.Text = (mh.ShelvesDefault != null) ? mh.ShelvesDefault.ToString() : "";
            txbSoluong.Text = (mh.Amount != null) ? mh.Amount.ToString() : "";
            //string vitrichuan = mh.ShelvesID.ToString();

            List<Product> lpd = new F_Product().GetMulti(x => x.BatchNumber == mh.BatchNumber).ToList();
            List<string> arrName = new List<string> { "A001", "A002", "A003", "A004", "B001", "B002", "B003", "B004", "C001", "C002", "C003", "C004", "D001", "D002", "D003", "D004" };
            int[] arrQuan = new int[arrName.Count];
            foreach (string name in arrName)
            {
                Control ctn = GetControlByName(name);
                ctn.Text = "0";
                ctn.BackColor = Color.Transparent;

            }

            foreach (Product pd in lpd)
            {
                int index = arrName.IndexOf(pd.ShelvesNow.ToString());

                arrQuan[index] += 1;

                Control ctn = GetControlByName(pd.ShelvesNow.ToString());

                if (pd.ShelvesNow.ToString() == mh.ShelvesDefault.ToString()) ctn.BackColor = Color.Green;
                else ctn.BackColor = Color.Red;

                ctn.Text = arrQuan[index].ToString();
                //string pos = name.Substring(3);

            }
            GetControlByName(mh.ShelvesDefault.ToString()).BackColor = Color.Green;

        }

        private void fTableManager_Load(object sender, EventArgs e)
        {

        }

        private void tabMathang_Selected(object sender, TabControlEventArgs e)
        {
            var cmd = db.Database.Connection.CreateCommand();
            cmd.CommandText = "SELECT * from [dbo].[GetCustomers]()";
            var table = new DataTable();

            cmd.Connection.Open();
            table.Load(cmd.ExecuteReader());
            dgvKhachhang.DataSource = table;
           
            cmd.Connection.Close();
            foreach (DataGridViewRow Myrow in dgvKhachhang.Rows)
            {            //Here 2 cell is target value and 1 cell is Volume
                if (Myrow.Cells[3].Value.ToString() != "Buon")// Or your condition 
                {
                    Myrow.DefaultCellStyle.BackColor = Color.Red;
                }
                else
                {
                    Myrow.DefaultCellStyle.BackColor = Color.Green;
                }
            }
        }

        private void dgvKhachhang_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void btnPublish_Click(object sender, EventArgs e)
        {
            if (txtTopicPublish.Text != "")
            {
                // whole topic
                string Topic = "cusCheckout";

                // publish a message with QoS 2
                client.Publish(Topic, Encoding.UTF8.GetBytes(txtTopicPublish.Text), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE  , true);
            }
            //else
            //{
            //    System.Windows.MessageBox.Show("You have to enter a topic to publish!");
            //}
        }
    }
}
