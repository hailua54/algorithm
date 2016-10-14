package moneytransfer;

import java.util.ArrayList;
import java.util.HashMap;

public class Application {
	
	protected SimpleDataBase db;
	protected HashMap<String, Object> lockHash;
	// define all user id
	protected int idA = 0, idB= 1, idC = 2;
	
	public Application()
	{
		this.lockHash = new HashMap<String, Object>();
		this.db = new SimpleDataBase();
	}
	
	public void testMoneyTransfer(String testcase, boolean isNormalTransfer, ArrayList<Object> transactions) throws InterruptedException
	{
		for (int i = 0; i < transactions.size(); i++)
		{
			int[] trans = (int[])transactions.get(i);
			Runnable task = () -> 
			{ 
				try
				{
					if (isNormalTransfer) this.deadLockTransferMoney(trans[0], trans[1], trans[2]);
					else this.resolveTransferMoney(trans[0], trans[1], trans[2]);
				}
				catch(Exception e){}
				finally { this.trace("complete !"); }
			};
			new Thread(task, "Thread " + i).start();
		}
	}
	
	public Object getLock(String key)
	{
		synchronized(this.lockHash)
		{
			if (!this.lockHash.containsKey(key)) this.lockHash.put(key, new Object());
			return this.lockHash.get(key);
		}
	}
	
	public void trace(String str)
	{
		System.out.println(Thread.currentThread().getName() + ": " + str);
	}
	
	public boolean deadLockTransferMoney(int sendId, int receivedId, int amount)
	{
		HashMap<String, Object> sendAccount;
		HashMap<String, Object> receivedAccount;
		int sendBalance, receivedBalance;
	
		synchronized(this.getLock(Integer.toString(sendId))) // lock here to make sure no one else can modify the database for sender account
		{
			trace("lock send mutex");
			trace("waiting for received mutex...");
			// give a small delay here to simulate concurrent thread
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			synchronized(this.getLock(Integer.toString(receivedId))) // lock here to make sure no one else can modify the database for receiver account
			{
				sendAccount = this.db.readAccount(sendId);
				if (sendAccount == null) return false;
				receivedAccount = this.db.readAccount(receivedId);
				if (receivedAccount == null) return false;
				sendBalance = (int)sendAccount.get("balance");
				receivedBalance = (int)receivedAccount.get("balance");
				this.trace("start transfering " + amount + " from " + sendId + " to " + receivedId);
				if (!this.db.writeBalance(sendId, sendBalance - amount)) return false;
				if (!this.db.writeBalance(receivedId, receivedBalance + amount))
				{
					// roll back
					this.db.writeBalance(sendId, sendBalance);
					return false;
				}
			}	
		}

		return true;
	}
	
	public boolean addBalance(int userId, int amount)
	{
		HashMap<String, Object> account;
		synchronized(this.getLock(Integer.toString(userId)))
		{
			account = this.db.readAccount(userId);
			if (account == null) return false;
			return this.db.writeBalance(userId, (int)account.get("balance") + amount);
		}
	}
	
	public boolean resolveTransferMoney(int sendId, int receivedId, int amount)
	{
		this.trace("start transfering " + amount + " from " + sendId + " to " + receivedId + "...");
		if (!this.addBalance(sendId, -amount)) return false;
		
		if (!this.addBalance(receivedId, amount)) 
		{
			this.addBalance(sendId, amount);
			return false;
		}
		return true;
	}
}
