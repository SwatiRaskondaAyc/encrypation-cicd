// import com.microsoft.sqlserver.jdbc.SQLServerColumnEncryptionJavaKeyStoreProvider;
// import com.microsoft.sqlserver.jdbc.SQLServerColumnEncryptionKeyStoreProvider;
// import com.microsoft.sqlserver.jdbc.SQLServerException;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.sql.SQLException;
// import java.sql.Statement;

// public class CreateCekUtility {
//     private static final String KEYSTORE_LOCATION = "//home/CMDA_Prod/Certs/CMK_portfuploads.jks";  // Path to your keystore.jks in Docker or VPS
//     private static final char[] KEYSTORE_SECRET = "admin@YC007star".toCharArray();  // Password you set for keystore.jks
//     private static final String KEY_ALIAS = "CMK_portfuploads";  // Alias from keytool command
//     private static final String CMK_NAME = "CMDA_CMK";  // Name of CMK in SQL Server
//     private static final String CEK_NAME = "CMDA_CEK";  // Name you choose for CEK
//     private static final String ALGORITHM = "RSA_OAEP";

//     public static void main(String[] args) {
//         String connectionUrl = "jdbc:sqlserver://168.231.121.219:1433;databaseName=CMDA_Users_Hub;user=kvm8_sa;password=Z@qDP5436;columnEncryptionSetting=Enabled;";

//         try (Connection connection = DriverManager.getConnection(connectionUrl);
//              Statement statement = connection.createStatement()) {

//             SQLServerColumnEncryptionKeyStoreProvider storeProvider = new SQLServerColumnEncryptionJavaKeyStoreProvider(KEYSTORE_LOCATION, KEYSTORE_SECRET);

//             // Generate a plain CEK (random 32-byte key; in production, generate securely)
//             String plainTextKey = "01234567890123456789012345678901";  // Replace with secure random bytes
//             byte[] plainCEK = plainTextKey.getBytes();

//             byte[] encryptedCEK = storeProvider.encryptColumnEncryptionKey(KEY_ALIAS, ALGORITHM, plainCEK);

//             String createCekSql = "CREATE COLUMN ENCRYPTION KEY " + CEK_NAME + " WITH VALUES ("
//                     + "COLUMN_MASTER_KEY = " + CMK_NAME + ", "
//                     + "ALGORITHM = '" + ALGORITHM + "', "
//                     + "ENCRYPTED_VALUE = 0x" + bytesToHex(encryptedCEK) + ")";

//             statement.executeUpdate(createCekSql);
//             System.out.println("CEK created: " + CEK_NAME);

//         } catch (SQLException | SQLServerException e) {
//             e.printStackTrace();
//         }
//     }

//     private static String bytesToHex(byte[] bytes) {
//         StringBuilder sb = new StringBuilder();
//         for (byte b : bytes) {
//             sb.append(String.format("%02X", b));
//         }
//         return sb.toString();
//     }
// }