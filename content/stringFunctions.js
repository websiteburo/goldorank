/**
 * stringFunctions.js
 *
 * This file contains a collection of string functions for javascript.
 * Most of them are inspired by their PHP equivalent.
 *
 * This source file is subject to version 2.1 of the GNU Lesser
 * General Public License (LPGL), found in the file LICENSE that is
 * included with this package, and is also available at
 * http://www.gnu.org/copyleft/lesser.html.
 * @package     Javascript
 *
 * @author      Dieter Raber <dieter@dieterraber.net>
 * @copyright   2004-12-27
 * @version     1.0
 * @license     http://www.gnu.org/copyleft/lesser.html
 *
 */

/**
 * TOC
 *
 * - hex2rgb
 * - htmlentities
 * - numericEntities
 * - trim
 * - ucfirst
 * - strPad
 */

/**
 * hex2rgb
 *
 * Convert hexadecimal color triplets to RGB
 *
 * Expects an hexadecimal color triplet (case insensitive)
 * Returns an array containing the decimal values
 * for r, g and b.
 *
 * example:
 *   test = 'ff0033'
 *   test.hex2rgb() //returns the array (255,00,51)
 */

String.prototype.hex2rgb = function()
{
  var red, green, blue;
  var triplet = this.toLowerCase().replace(/#/, '');
  var rgbArr  = new Array();

  if(triplet.length == 6)
  {
    rgbArr[0] = parseInt(triplet.substr(0,2), 16)
    rgbArr[1] = parseInt(triplet.substr(2,2), 16)
    rgbArr[2] = parseInt(triplet.substr(4,2), 16)
    return rgbArr;
  }
  else if(triplet.length == 3)
  {
    rgbArr[0] = parseInt((triplet.substr(0,1) + triplet.substr(0,1)), 16);
    rgbArr[1] = parseInt((triplet.substr(1,1) + triplet.substr(1,1)), 16);
    rgbArr[2] = parseInt((triplet.substr(2,2) + triplet.substr(2,2)), 16);
    return rgbArr;
  }
  else
  {
    throw triplet + ' is not a valid color triplet.';
  }
}


/**
 * htmlEntities
 *
 * Convert all applicable characters to HTML entities
 *
 * object string
 * return string
 *
 * example:
 *   test = 'äöü'
 *   test.htmlEntities() //returns '&auml;&ouml;&uuml;'
 */

String.prototype.htmlEntities = function()
{
  var chars = new Array ('&','à','á','â','ã','ä','å','æ','ç','è','é',
                         'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
                         'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
                         'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
                         'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
                         'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
                         '>','¢','£','¤','¥','¦','§','¨','©','ª','«',
                         '¬','­','®','¯','°','±','²','³','´','µ','¶',
                         '·','¸','¹','º','»','¼','½','¾');

  var entities = new Array ('amp','agrave','aacute','acirc','atilde','auml','aring',
                            'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
                            'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
                            'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
                            'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
                            'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
                            'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
                            'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
                            'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
                            'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
                            'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
                            'sup2','sup3','acute','micro','para','middot','cedil','sup1',
                            'ordm','raquo','frac14','frac12','frac34');

  newString = this;
  for (var i = 0; i < chars.length; i++)
  {
    myRegExp = new RegExp();
    myRegExp.compile(chars[i],'g')
    newString = newString.replace (myRegExp, '&' + entities[i] + ';');
  }
  return newString;
}

/**
 * safeEntities
 *
 * Henri Bourcereau
 * Hack pour goldorank: sécurise les entities une seconde fois...
 */
String.prototype.safeEntities = function(){
  //Ajout de nbsp et retrait de amp (sinon duplication de la sécurisation)
  var entities = new Array ('nbsp','agrave','aacute','acirc','atilde','auml','aring',
                            'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
                            'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
                            'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
                            'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
                            'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
                            'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
                            'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
                            'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
                            'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
                            'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
                            'sup2','sup3','acute','micro','para','middot','cedil','sup1',
                            'ordm','raquo','frac14','frac12','frac34');

  newString = this;
  for (var i = 0; i < entities.length; i++)
  {
    myRegExp = new RegExp();
    myRegExp.compile('&amp;'+entities[i]+';','g')
    newString = newString.replace (myRegExp, '&amp;amp;' + entities[i] + ';');
  }
  return newString;
}


/**
 * numericEntities
 *
 * Convert all applicable characters to numeric entities
 *
 * object string
 * return string
 *
 * example:
 *   test = 'äöü'
 *   test.numericEntities() //returns '&#228;&#246;&#252;'
 */

String.prototype.numericEntities = function()
{
  var i;
  var chars = new Array ('&','à','á','â','ã','ä','å','æ','ç','è','é',
                         'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
                         'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
                         'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
                         'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
                         'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
                         '>','¢','£','¤','¥','¦','§','¨','©','ª','«',
                         '¬','­','®','¯','°','±','²','³','´','µ','¶',
                         '·','¸','¹','º','»','¼','½','¾');

  var entities = new Array()
  for (i = 0; i < chars.length; i++)
  {
    entities[i] = chars[i].charCodeAt(0);
  }

  newString = this;
  for (i = 0; i < chars.length; i++)
  {
    myRegExp = new RegExp();
    myRegExp.compile(chars[i],'g')
    newString = newString.replace (myRegExp, '&#' + entities[i] + ';');
  }
  return newString;
}



/**
 * trim
 *
 * Strip whitespace from the beginning and end of a string
 *
 * object string
 * return string
 *
 * example:
 *   test = '\nsomestring\n\t\0'
 *   test.trim()  //returns 'somestring'
 */
String.prototype.trim = function()
{
  return this.replace(/^\s*([^ ]*)\s*$/, "$1");
}


/**
 * ucfirst
 *
 * Returns a string with the first character capitalized,
 * if that character is alphabetic.
 *
 * object string
 * return string
 *
 * example:
 *   test = 'john'
 *   test.ucfirst() //returns 'John'
 */

String.prototype.ucfirst = function()
{
  firstLetter = this.charCodeAt(0);
  if((firstLetter >= 97 && firstLetter <= 122)
     || (firstLetter >= 224 && firstLetter <= 246)
     || (firstLetter >= 249 && firstLetter <= 254))
  {
    firstLetter = firstLetter - 32;
  }
  alert(firstLetter)
  return String.fromCharCode(firstLetter) + this.substr(1,this.length -1)
}


/**
 * strPad
 *
 * Pad a string to a certain length with another string
 *
 * This functions returns the input string padded on the left, the right, or both sides
 * to the specified padding length. If the optional argument pad_string is not supplied,
 * the output is padded with spaces, otherwise it is padded with characters from pad_string
 * up to the limit.
 *
 * The optional argument pad_type can be STR_PAD_RIGHT, STR_PAD_LEFT, or STR_PAD_BOTH.
 * If pad_type is not specified it is assumed to be STR_PAD_RIGHT.
 *
 * If the value of pad_length is negative or less than the length of the input string,
 * no padding takes place.
 *
 * object string
 * return string
 *
 * examples:
 *   var input = 'foo';
 *   input.strPad(9);                      // returns "foo      "
 *   input.strPad(9, "*+", STR_PAD_LEFT);  // returns "*+*+*+foo"
 *   input.strPad(9, "*", STR_PAD_BOTH);   // returns "***foo***"
 *   input.strPad(9 , "*********");        // returns "foo******"
 */

var STR_PAD_LEFT  = 0;
var STR_PAD_RIGHT = 1;
var STR_PAD_BOTH  = 2;

String.prototype.strPad = function(pad_length, pad_string, pad_type)
{
  /* Helper variables */
  var num_pad_chars   = pad_length - this.length;/* Number of padding characters */
  var result          = '';                       /* Resulting string */
  var pad_str_val     = ' ';
  var pad_str_len     = 1;                        /* Length of the padding string */
  var pad_type_val    = STR_PAD_RIGHT;            /* The padding type value */
  var i               = 0;
  var left_pad        = 0;
  var right_pad       = 0;
  var error           = false;
  var error_msg       = '';
  var output           = this;

  if (arguments.length < 2 || arguments.length > 4)
  {
    error     = true;
    error_msg = "Wrong parameter count.";
  }


  else if(isNaN(arguments[0]) == true)
  {
    error     = true;
    error_msg = "Padding length must be an integer.";
  }
  /* Setup the padding string values if specified. */
  if (arguments.length > 2)
  {
    if (pad_string.length == 0)
    {
      error     = true;
      error_msg = "Padding string cannot be empty.";
    }
    pad_str_val = pad_string;
    pad_str_len = pad_string.length;

    if (arguments.length > 3)
    {
      pad_type_val = pad_type;
      if (pad_type_val < STR_PAD_LEFT || pad_type_val > STR_PAD_BOTH)
      {
        error     = true;
        error_msg = "Padding type has to be STR_PAD_LEFT, STR_PAD_RIGHT, or STR_PAD_BOTH."
      }
    }
  }

  if(error) throw error_msg;

  if(num_pad_chars > 0 && !error)
  {
    /* We need to figure out the left/right padding lengths. */
    switch (pad_type_val)
    {
      case STR_PAD_RIGHT:
        left_pad  = 0;
        right_pad = num_pad_chars;
        break;

      case STR_PAD_LEFT:
        left_pad  = num_pad_chars;
        right_pad = 0;
        break;

      case STR_PAD_BOTH:
        left_pad  = Math.floor(num_pad_chars / 2);
        right_pad = num_pad_chars - left_pad;
        break;
    }

    for(i = 0; i < left_pad; i++)
    {
      output = pad_str_val.substr(0,num_pad_chars) + output;
    }

    for(i = 0; i < right_pad; i++)
    {
      output += pad_str_val.substr(0,num_pad_chars);
    }
  }

  return output;
}
