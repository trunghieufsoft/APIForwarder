using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace WebApi.Common.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Adds a char to end of given string if it does not ends with the char.
        /// </summary>
        /// <param name="stringValue">
        /// The string value.
        /// </param>
        /// <param name="character">
        /// The character.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string EnsureEndsWith(this string stringValue, char character)
        {
            return EnsureEndsWith(stringValue, character, StringComparison.Ordinal);
        }

        /// <summary>
        /// Adds a char to end of given string if it does not ends with the char.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="character">
        /// The character.
        /// </param>
        /// <param name="comparisonType">
        /// The comparison Type.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string EnsureEndsWith(this string stringValue, char character, StringComparison comparisonType)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.EndsWith(character.ToString(), comparisonType))
            {
                return stringValue;
            }

            return stringValue + character;
        }

        /// <summary>
        /// Adds a char to beginning of given string if it does not starts with the char.
        /// </summary>
        /// <param name="stringValue">
        /// The string value.
        /// </param>
        /// <param name="character">
        /// The character.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string EnsureStartsWith(this string stringValue, char character)
        {
            return EnsureStartsWith(stringValue, character, StringComparison.InvariantCulture);
        }

        /// <summary>
        /// Adds a char to beginning of given string if it does not starts with the char.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="character">
        /// The character.
        /// </param>
        /// <param name="comparisonType">
        /// The comparison Type.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string EnsureStartsWith(this string stringValue, char character, StringComparison comparisonType)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.StartsWith(character.ToString(CultureInfo.InvariantCulture), comparisonType))
            {
                return stringValue;
            }

            return character + stringValue;
        }

        /// <summary>
        /// Adds a char to beginning of given string if it does not starts with the char.
        /// </summary>
        /// <param name="stringValue">
        /// The string value.
        /// </param>
        /// <param name="character">
        /// The character.
        /// </param>
        /// <param name="ignoreCase">
        /// The ignore Case.
        /// </param>
        /// <param name="culture">
        /// The culture.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string EnsureStartsWith(this string stringValue, char character, bool ignoreCase, CultureInfo culture)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.StartsWith(character.ToString(culture), ignoreCase, culture))
            {
                return stringValue;
            }

            return character + stringValue;
        }

        /// <summary>
        /// Indicates whether this string is null or an System.String.Empty string.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public static bool IsNullOrEmpty(this string stringValue)
        {
            return string.IsNullOrEmpty(stringValue);
        }

        /// <summary>
        /// indicates whether this string is null, empty, or consists only of white-space characters.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public static bool IsNullOrWhiteSpace(this string stringValue)
        {
            return string.IsNullOrWhiteSpace(stringValue);
        }

        /// <summary>
        /// Gets a substring of a string from beginning of the string.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="len">
        /// The len.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// Thrown if <paramref name="stringValue"/> is null
        /// </exception>
        /// <exception cref="ArgumentException">
        /// Thrown if <paramref name="len"/> is bigger that string's length
        /// </exception>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string Left(this string stringValue, int len)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.Length < len)
            {
                throw new ArgumentException("len argument can not be bigger than given string's length!");
            }

            return stringValue.Substring(0, len);
        }

        /// <summary>
        /// Converts line endings in the string to <see cref="Environment.NewLine"/>.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string NormalizeLineEndings(this string stringValue)
        {
            return stringValue.Replace("\r\n", "\n").Replace("\r", "\n").Replace("\n", Environment.NewLine);
        }

        /// <summary>
        /// Removes first occurrence of the given postfixes from end of the given string.
        /// </summary>
        /// <param name="str">The string.</param>
        /// <param name="postFixes">one or more postfix.</param>
        /// <returns>Modified string or the same string if it has not any of given postfixes</returns>
        public static string RemovePostFix(this string str, params string[] postFixes)
        {
            if (str.IsNullOrEmpty())
            {
                return null;
            }

            if (postFixes.IsNullOrEmpty())
            {
                return str;
            }

            foreach (var postFix in postFixes)
            {
                if (str.EndsWith(postFix))
                {
                    return str.Left(str.Length - postFix.Length);
                }
            }

            return str;
        }

        /// <summary>
        /// Removes first occurrence of the given prefixes from beginning of the given string.
        /// </summary>
        /// <param name="str">The string.</param>
        /// <param name="preFixes">one or more prefix.</param>
        /// <returns>Modified string or the same string if it has not any of given prefixes</returns>
        public static string RemovePreFix(this string str, params string[] preFixes)
        {
            if (str.IsNullOrEmpty())
            {
                return null;
            }

            if (preFixes.IsNullOrEmpty())
            {
                return str;
            }

            foreach (var preFix in preFixes)
            {
                if (str.StartsWith(preFix))
                {
                    return str.Right(str.Length - preFix.Length);
                }
            }

            return str;
        }

        /// <summary>
        /// Gets a substring of a string from end of the string.
        /// </summary>
        /// <param name="stringValue">
        /// The string value.
        /// </param>
        /// <param name="len">
        /// The len.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// Thrown if <paramref name="stringValue"/> is null
        /// </exception>
        /// <exception cref="ArgumentException">
        /// Thrown if <paramref name="len"/> is bigger that string's length
        /// </exception>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string Right(this string stringValue, int len)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.Length < len)
            {
                throw new ArgumentException("len argument can not be bigger than given string's length!");
            }

            return stringValue.Substring(stringValue.Length - len, len);
        }

        /// <summary>
        /// Uses string.Split method to split given string by given separator.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="separator">
        /// The separator.
        /// </param>
        /// <returns>
        /// The <see cref="string[]"/>.
        /// </returns>
        public static string[] Split(this string stringValue, string separator)
        {
            return stringValue.Split(new[] { separator }, StringSplitOptions.None);
        }

        /// <summary>
        /// Uses string.Split method to split given string by given separator.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="separator">
        /// The separator.
        /// </param>
        /// <param name="options">
        /// The options.
        /// </param>
        /// <returns>
        /// The <see cref="string[]"/>.
        /// </returns>
        public static string[] Split(this string stringValue, string separator, StringSplitOptions options)
        {
            return stringValue.Split(new[] { separator }, options);
        }

        /// <summary>
        /// Uses string.Split method to split given string by <see cref="Environment.NewLine"/>.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <returns>
        /// The <see cref="string[]"/>.
        /// </returns>
        public static string[] SplitToLines(this string stringValue)
        {
            return stringValue.Split(Environment.NewLine);
        }

        /// <summary>
        /// Uses string.Split method to split given string by <see cref="Environment.NewLine"/>.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="options">
        /// The options.
        /// </param>
        /// <returns>
        /// The <see cref="string[]"/>.
        /// </returns>
        public static string[] SplitToLines(this string stringValue, StringSplitOptions options)
        {
            return stringValue.Split(Environment.NewLine, options);
        }

        /// <summary>
        /// Converts PascalCase string to camelCase string.
        /// </summary>
        /// <param name="str">String to convert</param>
        /// <returns>camelCase of the string</returns>
        public static string ToCamelCase(this string str)
        {
            return str.ToCamelCase(CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Converts PascalCase string to camelCase string in specified culture.
        /// </summary>
        /// <param name="str">String to convert</param>
        /// <param name="culture">An object that supplies culture-specific casing rules</param>
        /// <returns>camelCase of the string</returns>
        public static string ToCamelCase(this string str, CultureInfo culture)
        {
            if (string.IsNullOrWhiteSpace(str))
            {
                return str;
            }

            if (str.Length == 1)
            {
                return str.ToLower(culture);
            }

            return char.ToLower(str[0], culture) + str.Substring(1);
        }

        /// <summary>
        /// Converts given PascalCase/camelCase string to sentence (by splitting words by space).
        /// Example: "ThisIsSampleSentence" is converted to "This is a sample sentence".
        /// </summary>
        /// <param name="stringValue">
        /// String to convert.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string ToSentenceCase(this string stringValue)
        {
            return stringValue.ToSentenceCase(CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Converts given PascalCase/camelCase string to sentence (by splitting words by space).
        /// Example: "ThisIsSampleSentence" is converted to "This is a sample sentence".
        /// </summary>
        /// <param name="stringValue">
        /// String to convert.
        /// </param>
        /// <param name="culture">
        /// An object that supplies culture-specific casing rules.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string ToSentenceCase(this string stringValue, CultureInfo culture)
        {
            if (string.IsNullOrWhiteSpace(stringValue))
            {
                return stringValue;
            }

            return Regex.Replace(stringValue, "[a-z][A-Z]", m => m.Value[0] + " " + char.ToLower(m.Value[1], culture));
        }

        /// <summary>
        /// Converts string to enumeration value.
        /// </summary>
        /// <typeparam name="T">Type of enumeration</typeparam>
        /// <param name="value">String value to convert</param>
        /// <returns>Returns enumeration object</returns>
        public static T ToEnum<T>(this string value)
            where T : struct
        {
            if (value == null)
            {
                throw new ArgumentNullException(nameof(value));
            }

            return (T)Enum.Parse(typeof(T), value);
        }

        /// <summary>
        /// Converts string to enumeration value.
        /// </summary>
        /// <typeparam name="T">Type of enumeration</typeparam>
        /// <param name="value">String value to convert</param>
        /// <param name="ignoreCase">Ignore case</param>
        /// <returns>Returns enumeration object</returns>
        public static T ToEnum<T>(this string value, bool ignoreCase)
            where T : struct
        {
            if (value == null)
            {
                throw new ArgumentNullException(nameof(value));
            }

            return (T)Enum.Parse(typeof(T), value, ignoreCase);
        }

        public static string ToMd5(this string str)
        {
            using (var md5 = MD5.Create())
            {
                var inputBytes = Encoding.UTF8.GetBytes(str);
                var hashBytes = md5.ComputeHash(inputBytes);

                var sb = new StringBuilder();
                foreach (var hashByte in hashBytes)
                {
                    sb.Append(hashByte.ToString("X2"));
                }

                return sb.ToString();
            }
        }

        /// <summary>
        /// Converts camelCase string to PascalCase string.
        /// </summary>
        /// <param name="str">String to convert</param>
        /// <returns>PascalCase of the string</returns>
        public static string ToPascalCase(this string str)
        {
            return str.ToPascalCase(CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Converts camelCase string to PascalCase string in specified culture.
        /// </summary>
        /// <param name="str">String to convert</param>
        /// <param name="culture">An object that supplies culture-specific casing rules</param>
        /// <returns>PascalCase of the string</returns>
        public static string ToPascalCase(this string str, CultureInfo culture)
        {
            if (string.IsNullOrWhiteSpace(str))
            {
                return str;
            }

            if (str.Length == 1)
            {
                return str.ToUpper(culture);
            }

            return char.ToUpper(str[0], culture) + str.Substring(1);
        }

        /// <summary>
        /// Gets a substring of a string from beginning of the string if it exceeds maximum length.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="maxLength">
        /// The max Length.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// Thrown if <paramref name="stringValue"/> is null
        /// </exception>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string Truncate(this string stringValue, int maxLength)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue.Length <= maxLength)
            {
                return stringValue;
            }

            return stringValue.Left(maxLength);
        }

        /// <summary>
        /// Gets a substring of a string from beginning of the string if it exceeds maximum length.
        /// It adds a "..." postfix to end of the string if it's truncated.
        /// Returning string can not be longer than maxLength.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="maxLength">
        /// The max Length.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// Thrown if <paramref name="stringValue"/> is null
        /// </exception>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string TruncateWithPostfix(this string stringValue, int maxLength)
        {
            return TruncateWithPostfix(stringValue, maxLength, "...");
        }

        /// <summary>
        /// Gets a substring of a string from beginning of the string if it exceeds maximum length.
        /// It adds given <paramref name="postfix"/> to end of the string if it's truncated.
        /// Returning string can not be longer than maxLength.
        /// </summary>
        /// <param name="stringValue">
        /// The string Value.
        /// </param>
        /// <param name="maxLength">
        /// The max Length.
        /// </param>
        /// <param name="postfix">
        /// The postfix.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// Thrown if <paramref name="stringValue"/> is null
        /// </exception>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string TruncateWithPostfix(this string stringValue, int maxLength, string postfix)
        {
            if (stringValue == null)
            {
                throw new ArgumentNullException(nameof(stringValue));
            }

            if (stringValue == string.Empty || maxLength == 0)
            {
                return string.Empty;
            }

            if (stringValue.Length <= maxLength)
            {
                return stringValue;
            }

            if (maxLength <= postfix.Length)
            {
                return postfix.Left(maxLength);
            }

            return stringValue.Left(maxLength - postfix.Length) + postfix;
        }
    }
}
