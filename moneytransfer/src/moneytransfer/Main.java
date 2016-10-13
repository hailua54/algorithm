package moneytransfer;

import java.util.ArrayList;

public class Main {
	
	public static void main(String[] args) throws InterruptedException
	{
		if (args.length == 0) args = new String[]{"default_testcase", "true", "0,1,50;1,0,50"};
		Application app = new Application();
		System.out.println("start " + args[0] + "...");
		Object[] params = args[2].split(";");
		ArrayList<Object> infos = new ArrayList<Object>();
		for (int i = 0; i < params.length; i++) 
		{
			String[] arr = ((String)params[i]).split(",");
			int[] vals = new int[arr.length];
			for (int j = 0; j < arr.length; j++) vals[j] = Integer.parseInt(arr[j]);
			infos.add(vals);
		}
		
		app.testMoneyTransfer(args[0], args[1].equals("true"), infos);
		Thread.sleep(2000);
		System.exit(0);
	}
}
