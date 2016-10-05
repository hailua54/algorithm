function getNumInFormat(num, d = 2)
{
	var s = num.toString();
	var arr = s.split('.');
	// pre
	var s0 = arr[0];
	var pre = "";
	var count = 0;
	for (var i = s0.length - 1; i > 0; i--)
	{
		count++;
		pre = s0.charAt(i) + pre;
		if (count == 3)
		{
			pre = ',' + pre;
			count = 0;
		}
	}
	pre = s0.charAt(0) + pre;

	if (d == 0) return pre;

	// pos
	var zero = "0000000000000000";
	if (arr.length == 1) return pre + '.' + zero.substr(0, d);

	var s1 = arr[1].substr(0, d);
	s1 += zero.substr(0, d - s1.length);
	return pre + '.' + s1;
}