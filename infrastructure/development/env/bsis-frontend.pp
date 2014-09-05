# Puppet manifest
#
# Required modules:
# willdurand/nodejs
#

# defaults for Exec
Exec {
	path => ["/bin", "/sbin", "/usr/bin", "/usr/sbin", "/usr/local/bin", "/usr/local/sbin", "/usr/local/node/node-default/bin/"],
	user => "root",
}

# Install required packages
Package { ensure => "installed" }
package { "git": }
package { "libfontconfig1": }

class { "nodejs":
	version => "stable",
}

exec { "npm-install":
	cwd => "/bsis-frontend",
	command => "npm install",
	require => Class["nodejs"],
}

exec { "install-bower":
	cwd => "/bsis-frontend",
	command => "npm install -g bower",
	unless => "npm list -g bower",
	require => Class["nodejs"],
}

exec { "install-grunt":
	cwd => "/bsis-frontend",
	command => "npm install -g grunt-cli",
	unless => "npm list -g grunt-cli",
	require => Class["nodejs"],
}

exec { "bower-install":
	cwd => "/bsis-frontend",
	command => "bower --allow-root install",
	require => Exec["install-bower"],
}