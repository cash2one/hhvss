﻿<?xml version="1.0"  encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<!-- main start. -->
	<xsl:template match="/">
		<xsl:call-template name="show_sheetlist" />
	</xsl:template>

	<xsl:template name="show_sheetlist">
		<xsl:element name="table">
			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					单据编号
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/sheetid" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					城市公司
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/bookname" />
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					供应商编码
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/venderid" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					供应商名称
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/vendername" />
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					开户银行
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/bankname" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					银行帐号
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/bankaccno" />
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					支付方式
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/paymodename" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					本期对帐金额
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of
						select="format-number(number(/xdoc/xout/head/rows/payamt)-number(/xdoc/xout/head/rows/chargeamt),'#,##0.00')" />

				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					计划付款日期
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of select="/xdoc/xout/head/rows/planpaydate" />
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					17%税建议开票金额
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of
						select="format-number(number(/xdoc/xout/head/rows/invtotalamt17),'#,##0.00')" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					13%税建议开票金额
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of
						select="format-number(number(/xdoc/xout/head/rows/invtotalamt13),'#,##0.00')" />
				</xsl:element>
			</xsl:element>

			<xsl:element name="tr">
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					0%税建议开票金额
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of
						select="format-number(number(/xdoc/xout/head/rows/invtotalamt0),'#,##0.00')" />
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					预付款冲抵金额
				</xsl:element>
				<xsl:element name="td">
					<xsl:attribute name="align">left</xsl:attribute>
					<xsl:value-of
						select="format-number(number(/xdoc/xout/head/rows/suspayamt),'#,##0.00')" />
				</xsl:element>
			</xsl:element>

		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
