/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog.security.authservice.ldap;

import com.google.auto.value.AutoValue;

import java.util.EnumSet;
import java.util.stream.Collectors;

/**
 * Active Directory UserAccountControl flags.
 *
 * See: https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties
 */

@AutoValue
public abstract class ADUserAccountControl {

    public abstract EnumSet<Flags> flags();

    public static ADUserAccountControl create(int userAccountControlField) {
        EnumSet<Flags> set = EnumSet.noneOf(Flags.class);
        for (Flags flag : Flags.values()) {
            if (flag.isSetIn(userAccountControlField)) {
                set.add(flag);
            }
        }
        return new AutoValue_ADUserAccountControl(set);
    }

    public boolean accountIsDisabled() {
        return flags().contains(Flags.ACCOUNTDISABLE);
    }

    public boolean isUserAccount() {
        return flags().contains(Flags.NORMAL_ACCOUNT);
    }

    public boolean passwordExpired() {
        return flags().contains(Flags.PASSWORD_EXPIRED);
    }

    public String printFlags() {
        return flags().stream().sorted().map(Enum::toString).collect(Collectors.joining("|"));
    }

    public enum Flags {
        /**
         * The user account is disabled.
         */
        ACCOUNTDISABLE(0x2),

        /**
         * This is a default account type that represents a typical user. (not a computer, for example)
         */
        NORMAL_ACCOUNT(0x200),

        /**
         * The user password has expired. (This doesn't work with newer AD implementations)
         */
        PASSWORD_EXPIRED(0x800000);

        public int getFlagValue() {
            return flagValue;
        }

        private final int flagValue;

        Flags(int flagValue) {
            this.flagValue = flagValue;
        }

        public boolean isSetIn(int userAccountControlValue) {
            return (userAccountControlValue & flagValue) > 0;
        }
    }
}
