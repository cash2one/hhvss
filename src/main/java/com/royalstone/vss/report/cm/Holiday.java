package com.royalstone.vss.report.cm;

import java.sql.Connection;
import java.util.Map;

import com.royalstone.security.Token;
import com.royalstone.util.InvalidDataException;
import com.royalstone.util.aw.CMQueryService;
import com.royalstone.util.daemon.Filter;
import com.royalstone.util.daemon.Values;

public class Holiday extends CMQueryService {

	public Holiday(Connection conn, Token token) {
		super(conn, token);
	}

	public Filter cookFilter(Map map) throws InvalidDataException {
		Filter filter = new Filter();
		String[] ss = null;

		ss = (String[]) map.get("maxvenderid");
		if (ss != null && ss.length > 0) {
			filter.add(" a.venderid <= " + Values.toString4String(ss[0]));
		}
		
		ss = (String[]) map.get("minvenderid");
		if (ss != null && ss.length > 0) {
			filter.add(" a.venderid >= " + Values.toString4String(ss[0]));
		}
		
		ss = (String[]) map.get("htype");
		if (ss != null && ss.length > 0) {
			filter.add(" b.htype = " + Values.toString4String(ss[0]));
		}
		ss = (String[]) map.get("year");
		if (ss != null && ss.length > 0) {
			filter.add(" a.year = " + Values.toString4String(ss[0]));
		}
		return filter;
	}
}
