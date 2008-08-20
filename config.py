#!/usr/bin/env python
#-*- coding: utf-8 -*-

app = 'goldorank'
name = 'Goldorank'
description = 'Search engines position retriever by WebSiteBuro'
author = 'Henri Bourcereau'
authorURL = "http://www.websiteburo.com"
uid = 'e4b43b01-1ccb-476a-92d2-9a193ad4ff50'
#clé publique de 'goldorank' générée par mccoy (sans mot de passe pour utilisation par spock)
updateKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZQlUWmH3uuZ6UE4QswRRjGoiXJwdWB+U072dnBXrZB/533kYwRJwZYBzIozayvUrvxojQDa7ZjJ47o8qPJ57F/+b0YM5kcoppVJZ6U0sEbxL+8X8Cgn8TTg7jbaKQyzr+/uqxYebUzPnr9MEYf2mW2j1UFOZ5A6Nbj78GyLEg4wIDAQAB'
nssDirectory = '/home/henri/.mozilla/mccoy/2osghvae.default/'

major_version = 0
minor_version = 8
build_version = 3
in_development = False
whatsnew = '<ul><li>Compatible with Firefox 3</li><li>Some corrections in search engines definitions</li></ul>'

version = "%d.%d.%d%s" % (
    major_version,
    minor_version,
    build_version,
    in_development and "+" or ""

)

homepageURL = "http://www.websiteburo.com/%(app)s" % vars()
updateURL = "%(homepageURL)s/update.rdf" % vars()
updateInfoFile = "updateinfo%(version)s.xhtml" % vars() 
updateFile = "%(app)s-%(version)s.xpi" % vars()
updateLink = "%(homepageURL)s/%(updateFile)s" % vars()
firefoxUID = 'ec8030f7-c20a-464f-9b0e-13a3a9e97384'
firefoxMinVersion = '1.5'
firefoxMaxVersion = '3.0.*'

overlays = (
    # overlay this on that

    ('%(app)s/content/browser.xul' % vars(), 'browser/content/browser.xul' % vars()),
)
stylesheets = (
    # overlay this on that
)

skins = {
    'classic': {
        'skin_version': '1.0',
        'display_name': name,
    },
}

locales = {
    'en-US': {
        'locale_version': '1.0',
        'display_name': 'English (US)',
    },
    'fr-FR': {
        'locale_version': '1.0',
        'display_name': 'Français',
    },
}

