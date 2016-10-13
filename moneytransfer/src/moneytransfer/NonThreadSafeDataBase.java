package moneytransfer;
import java.lang.Object;
import java.util.HashMap;
/**
 * 
 * @author user
 * This is a non thread safe DataBase. You might need to lock/synchronize your self
 *   
 */
public class NonThreadSafeDataBase {
	private Object[] accountTable;
	private int MIN_BALANCE = 50;
	public NonThreadSafeDataBase() {
		// table with columns: id, name, amount
		this.accountTable = new Object[]{new String[]{"A", "B", "C"}, new int[]{100, 200, 300}};
	}
	
	public HashMap<String, Object> readAccount(int userId)
	{
		HashMap<String, Object> record = new HashMap<String, Object>();
		if (userId < 0 || userId > ((String[])this.accountTable[0]).length) return null;
		record.put("id", userId);
		record.put("name", ((String[])this.accountTable[0])[userId]);
		record.put("balance", ((int[])this.accountTable[1])[userId]);
		return record;
	}
	
	public Boolean writeBalance(int userId, int amount)
	{
		if (userId < 0 || userId > ((String[])this.accountTable[0]).length) return false;
		if (amount < this.MIN_BALANCE) return false;
		((int[])this.accountTable[1])[userId] = amount;
		System.out.println("DataBase log: update balance successully for " + userId + "_" + ((String[])this.accountTable[0])[userId]  + " new balance: " + ((int[])this.accountTable[1])[userId]);
		return true;
	}
}