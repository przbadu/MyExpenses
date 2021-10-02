import currency from 'currency.js';
const SI_SYMBOLS = ['', 'k', 'M', 'B', 'T', 'P', 'E'];

/**
 *
 * @param amount - amount to be formatted
 * @param symbol - currency symbol
 * @returns Currency formatted amount e.g: $200, NPR 1,200
 */
export const numberToCurrency = (amount: number | string, symbol: string) =>
  currency(amount, {symbol: `${symbol} `}).format();

/**
 *
 * @param number Number to be converted e.g: 10000
 * @param minDigits Minimum precision e.g: 1.0K
 * @param maxDigits maximum precision e.g: 1.0000K
 * @returns return number in human readable format e.g: 1.1K, 2M, 3B
 */
export const numberToHumanize = (
  number: number,
  minDigits: number = 1,
  maxDigits: number = 1,
) => {
  if (number === 0) return number;

  // determines SI symbol
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

  // get suffix and determine scale
  const suffix = SI_SYMBOLS[tier];
  const scale = 10 ** (tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return (
    scaled.toLocaleString(undefined, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }) + suffix
  );
};

export function getSiSymbol(number: number) {
  if (number < 0) return '';

  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);
  return SI_SYMBOLS[tier];
}

export function amountSeperator(number: number, avg: number) {
  if (number === 0) return number;

  const tier = Math.floor(Math.log10(Math.abs(avg)) / 3);
  const scale = 10 ** (tier * 3);
  return number / scale;
}

export const currencies = [
  {isoCode: 'AED', name: 'United Arab Emirates Dirham'},
  {isoCode: 'AFN', name: 'Afghan Afghani'},
  {isoCode: 'ALL', name: 'Albanian Lek'},
  {isoCode: 'AMD', name: 'Armenian Dram'},
  {isoCode: 'ANG', name: 'Netherlands Antillean Guilder'},
  {isoCode: 'AOA', name: 'Angolan Kwanza'},
  {isoCode: 'ARS', name: 'Argentine Peso'},
  {isoCode: 'AUD', name: 'Australian Dollar'},
  {isoCode: 'AWG', name: 'Aruban Florin'},
  {isoCode: 'AZN', name: 'Azerbaijani Manat'},
  {isoCode: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark'},
  {isoCode: 'BBD', name: 'Barbadian Dollar'},
  {isoCode: 'BDT', name: 'Bangladeshi Taka'},
  {isoCode: 'BGN', name: 'Bulgarian Lev'},
  {isoCode: 'BHD', name: 'Bahraini Dinar'},
  {isoCode: 'BIF', name: 'Burundian Franc'},
  {isoCode: 'BMD', name: 'Bermudan Dollar'},
  {isoCode: 'BND', name: 'Brunei Dollar'},
  {isoCode: 'BOB', name: 'Bolivian Boliviano'},
  {isoCode: 'BRL', name: 'Brazilian Real'},
  {isoCode: 'BSD', name: 'Bahamian Dollar'},
  {isoCode: 'BTC', name: 'Bitcoin'},
  {isoCode: 'BTN', name: 'Bhutanese Ngultrum'},
  {isoCode: 'BWP', name: 'Botswanan Pula'},
  {isoCode: 'BYN', name: 'Belarusian Ruble'},
  {isoCode: 'BZD', name: 'Belize Dollar'},
  {isoCode: 'CAD', name: 'Canadian Dollar'},
  {isoCode: 'CDF', name: 'Congolese Franc'},
  {isoCode: 'CHF', name: 'Swiss Franc'},
  {isoCode: 'CLF', name: 'Chilean Unit of Account (UF)'},
  {isoCode: 'CLP', name: 'Chilean Peso'},
  {isoCode: 'CNH', name: 'Chinese Yuan (Offshore)'},
  {isoCode: 'CNY', name: 'Chinese Yuan'},
  {isoCode: 'COP', name: 'Colombian Peso'},
  {isoCode: 'CRC', name: 'Costa Rican Colón'},
  {isoCode: 'CUC', name: 'Cuban Convertible Peso'},
  {isoCode: 'CUP', name: 'Cuban Peso'},
  {isoCode: 'CVE', name: 'Cape Verdean Escudo'},
  {isoCode: 'CZK', name: 'Czech Republic Koruna'},
  {isoCode: 'DJF', name: 'Djiboutian Franc'},
  {isoCode: 'DKK', name: 'Danish Krone'},
  {isoCode: 'DOP', name: 'Dominican Peso'},
  {isoCode: 'DZD', name: 'Algerian Dinar'},
  {isoCode: 'EGP', name: 'Egyptian Pound'},
  {isoCode: 'ERN', name: 'Eritrean Nakfa'},
  {isoCode: 'ETB', name: 'Ethiopian Birr'},
  {isoCode: 'EUR', name: 'Euro'},
  {isoCode: 'FJD', name: 'Fijian Dollar'},
  {isoCode: 'FKP', name: 'Falkland Islands Pound'},
  {isoCode: 'GBP', name: 'British Pound Sterling'},
  {isoCode: 'GEL', name: 'Georgian Lari'},
  {isoCode: 'GGP', name: 'Guernsey Pound'},
  {isoCode: 'GHS', name: 'Ghanaian Cedi'},
  {isoCode: 'GIP', name: 'Gibraltar Pound'},
  {isoCode: 'GMD', name: 'Gambian Dalasi'},
  {isoCode: 'GNF', name: 'Guinean Franc'},
  {isoCode: 'GTQ', name: 'Guatemalan Quetzal'},
  {isoCode: 'GYD', name: 'Guyanaese Dollar'},
  {isoCode: 'HKD', name: 'Hong Kong Dollar'},
  {isoCode: 'HNL', name: 'Honduran Lempira'},
  {isoCode: 'HRK', name: 'Croatian Kuna'},
  {isoCode: 'HTG', name: 'Haitian Gourde'},
  {isoCode: 'HUF', name: 'Hungarian Forint'},
  {isoCode: 'IDR', name: 'Indonesian Rupiah'},
  {isoCode: 'ILS', name: 'Israeli New Sheqel'},
  {isoCode: 'IMP', name: 'Manx pound'},
  {isoCode: 'INR', name: 'Indian Rupee'},
  {isoCode: 'IQD', name: 'Iraqi Dinar'},
  {isoCode: 'IRR', name: 'Iranian Rial'},
  {isoCode: 'ISK', name: 'Icelandic Króna'},
  {isoCode: 'JEP', name: 'Jersey Pound'},
  {isoCode: 'JMD', name: 'Jamaican Dollar'},
  {isoCode: 'JOD', name: 'Jordanian Dinar'},
  {isoCode: 'JPY', name: 'Japanese Yen'},
  {isoCode: 'KES', name: 'Kenyan Shilling'},
  {isoCode: 'KGS', name: 'Kyrgystani Som'},
  {isoCode: 'KHR', name: 'Cambodian Riel'},
  {isoCode: 'KMF', name: 'Comorian Franc'},
  {isoCode: 'KPW', name: 'North Korean Won'},
  {isoCode: 'KRW', name: 'South Korean Won'},
  {isoCode: 'KWD', name: 'Kuwaiti Dinar'},
  {isoCode: 'KYD', name: 'Cayman Islands Dollar'},
  {isoCode: 'KZT', name: 'Kazakhstani Tenge'},
  {isoCode: 'LAK', name: 'Laotian Kip'},
  {isoCode: 'LBP', name: 'Lebanese Pound'},
  {isoCode: 'LKR', name: 'Sri Lankan Rupee'},
  {isoCode: 'LRD', name: 'Liberian Dollar'},
  {isoCode: 'LSL', name: 'Lesotho Loti'},
  {isoCode: 'LYD', name: 'Libyan Dinar'},
  {isoCode: 'MAD', name: 'Moroccan Dirham'},
  {isoCode: 'MDL', name: 'Moldovan Leu'},
  {isoCode: 'MGA', name: 'Malagasy Ariary'},
  {isoCode: 'MKD', name: 'Macedonian Denar'},
  {isoCode: 'MMK', name: 'Myanma Kyat'},
  {isoCode: 'MNT', name: 'Mongolian Tugrik'},
  {isoCode: 'MOP', name: 'Macanese Pataca'},
  {isoCode: 'MRO', name: 'Mauritanian Ouguiya (pre-2018)'},
  {isoCode: 'MRU', name: 'Mauritanian Ouguiya'},
  {isoCode: 'MUR', name: 'Mauritian Rupee'},
  {isoCode: 'MVR', name: 'Maldivian Rufiyaa'},
  {isoCode: 'MWK', name: 'Malawian Kwacha'},
  {isoCode: 'MXN', name: 'Mexican Peso'},
  {isoCode: 'MYR', name: 'Malaysian Ringgit'},
  {isoCode: 'MZN', name: 'Mozambican Metical'},
  {isoCode: 'NAD', name: 'Namibian Dollar'},
  {isoCode: 'NGN', name: 'Nigerian Naira'},
  {isoCode: 'NIO', name: 'Nicaraguan Córdoba'},
  {isoCode: 'NOK', name: 'Norwegian Krone'},
  {isoCode: 'NPR', name: 'Nepalese Rupee'},
  {isoCode: 'NZD', name: 'New Zealand Dollar'},
  {isoCode: 'OMR', name: 'Omani Rial'},
  {isoCode: 'PAB', name: 'Panamanian Balboa'},
  {isoCode: 'PEN', name: 'Peruvian Nuevo Sol'},
  {isoCode: 'PGK', name: 'Papua New Guinean Kina'},
  {isoCode: 'PHP', name: 'Philippine Peso'},
  {isoCode: 'PKR', name: 'Pakistani Rupee'},
  {isoCode: 'PLN', name: 'Polish Zloty'},
  {isoCode: 'PYG', name: 'Paraguayan Guarani'},
  {isoCode: 'QAR', name: 'Qatari Rial'},
  {isoCode: 'RON', name: 'Romanian Leu'},
  {isoCode: 'RSD', name: 'Serbian Dinar'},
  {isoCode: 'RUB', name: 'Russian Ruble'},
  {isoCode: 'RWF', name: 'Rwandan Franc'},
  {isoCode: 'SAR', name: 'Saudi Riyal'},
  {isoCode: 'SBD', name: 'Solomon Islands Dollar'},
  {isoCode: 'SCR', name: 'Seychellois Rupee'},
  {isoCode: 'SDG', name: 'Sudanese Pound'},
  {isoCode: 'SEK', name: 'Swedish Krona'},
  {isoCode: 'SGD', name: 'Singapore Dollar'},
  {isoCode: 'SHP', name: 'Saint Helena Pound'},
  {isoCode: 'SLL', name: 'Sierra Leonean Leone'},
  {isoCode: 'SOS', name: 'Somali Shilling'},
  {isoCode: 'SRD', name: 'Surinamese Dollar'},
  {isoCode: 'SSP', name: 'South Sudanese Pound'},
  {isoCode: 'STD', name: 'São Tomé and Príncipe Dobra (pre-2018)'},
  {isoCode: 'STN', name: 'São Tomé and Príncipe Dobra'},
  {isoCode: 'SVC', name: 'Salvadoran Colón'},
  {isoCode: 'SYP', name: 'Syrian Pound'},
  {isoCode: 'SZL', name: 'Swazi Lilangeni'},
  {isoCode: 'THB', name: 'Thai Baht'},
  {isoCode: 'TJS', name: 'Tajikistani Somoni'},
  {isoCode: 'TMT', name: 'Turkmenistani Manat'},
  {isoCode: 'TND', name: 'Tunisian Dinar'},
  {isoCode: 'TOP', name: "Tongan Pa'anga"},
  {isoCode: 'TRY', name: 'Turkish Lira'},
  {isoCode: 'TTD', name: 'Trinidad and Tobago Dollar'},
  {isoCode: 'TWD', name: 'New Taiwan Dollar'},
  {isoCode: 'TZS', name: 'Tanzanian Shilling'},
  {isoCode: 'UAH', name: 'Ukrainian Hryvnia'},
  {isoCode: 'UGX', name: 'Ugandan Shilling'},
  {isoCode: 'USD', name: 'United States Dollar'},
  {isoCode: 'UYU', name: 'Uruguayan Peso'},
  {isoCode: 'UZS', name: 'Uzbekistan Som'},
  {isoCode: 'VEF', name: 'Venezuelan Bolívar Fuerte (Old)'},
  {isoCode: 'VES', name: 'Venezuelan Bolívar Soberano'},
  {isoCode: 'VND', name: 'Vietnamese Dong'},
  {isoCode: 'VUV', name: 'Vanuatu Vatu'},
  {isoCode: 'WST', name: 'Samoan Tala'},
  {isoCode: 'XAF', name: 'CFA Franc BEAC'},
  {isoCode: 'XAG', name: 'Silver Ounce'},
  {isoCode: 'XAU', name: 'Gold Ounce'},
  {isoCode: 'XCD', name: 'East Caribbean Dollar'},
  {isoCode: 'XDR', name: 'Special Drawing Rights'},
  {isoCode: 'XOF', name: 'CFA Franc BCEAO'},
  {isoCode: 'XPD', name: 'Palladium Ounce'},
  {isoCode: 'XPF', name: 'CFP Franc'},
  {isoCode: 'XPT', name: 'Platinum Ounce'},
  {isoCode: 'YER', name: 'Yemeni Rial'},
  {isoCode: 'ZAR', name: 'South African Rand'},
  {isoCode: 'ZMW', name: 'Zambian Kwacha'},
  {isoCode: 'ZWL', name: 'Zimbabwean Dollar'},
];
