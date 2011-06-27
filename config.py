#!/usr/bin/env python
#-*- coding: utf-8 -*-

app = 'goldorank'
name = 'Goldorank'
description = 'Search engines position retriever by WebSiteBuro'
author = 'Henri Bourcereau'
authorURL = "http://www.websiteburo.com"

#uid = 'e4b43b01-1ccb-476a-92d2-9a193ad4ff50'
#clé publique de 'goldorank' générée par mccoy (sans mot de passe pour utilisation par spock)
#goldorankOld:
#updateKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZQlUWmH3uuZ6UE4QswRRjGoiXJwdWB+U072dnBXrZB/533kYwRJwZYBzIozayvUrvxojQDa7ZjJ47o8qPJ57F/+b0YM5kcoppVJZ6U0sEbxL+8X8Cgn8TTg7jbaKQyzr+/uqxYebUzPnr9MEYf2mW2j1UFOZ5A6Nbj78GyLEg4wIDAQAB'
#initial (rev. 113, goldorank 0.8.0):
#updateKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDqA8cSkYutSOSs/PoxLBe/KWMNUmq7snZwKxLvaoZCcSn19LZusq9LKnQrsrawB+aLzCXX2U6i1xA0owmf1VSdC0xZQhzecdHBribyHAPkEu8wx0fy1ADCxxXJ52xkRNi8pOVOuI9nX9DN9GuL3M/zCfIftgCb3fkEmVqIZvcISQIDAQAB'

uid = 'goldorank@websiteburo.com'
#clé publique de 'goldorank' générée par mccoy (sans mot de passe pour utilisation par spock)
updateKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ5BxILWr1SzZwhFmSv+0AuHxWw8JFJJ5IhJHlkNKsEyevTYGyV6N0yyzvTObKJ9PtmC5e14ZYhXlhp6dMaAUh1KsDilRgIiuNaEr7tZTwHAPv55RnZTMHF0Q6XLMkSq2/Iyk2LWbsy4H5cEqvrM7CxEIeTXAAWB0OJ7YH8XmMLQIDAQAB'
nssDirectory = '/home/henri/.mozilla/mccoy/2osghvae.default/'

major_version = 0
minor_version = 9
build_version = 3
in_development = False
whatsnew = '<ul><li>Firefox 5 compatibility</li></ul>'

version = "%d.%d.%d%s" % (
    major_version,
    minor_version,
    build_version,
    in_development and "+" or ""

)

homepageURL = "http://www.websiteburo.com/%(app)s" % vars()
iconURL = "logo.png"
updateURL = "%(homepageURL)s/update.rdf" % vars()
updateInfoFile = "updateinfo%(version)s.xhtml" % vars() 
updateFile = "%(app)s-%(version)s.xpi" % vars()
updateLink = "%(homepageURL)s/%(updateFile)s" % vars()
firefoxUID = 'ec8030f7-c20a-464f-9b0e-13a3a9e97384'
firefoxMinVersion = '1.5'
firefoxMaxVersion = '5.0.*'

overlays = (
    # overlay this on that

    ('%(app)s/content/browser.xul' % vars(), 'browser/content/browser.xul' % vars()),
)
stylesheets = (
    # overlay this on that
    ('%(app)s/content/goldorank.css' % vars(), 'global/content/customizeToolbar.xul' % vars()),
    ('%(app)s/content/goldorank.css' % vars(), 'browser/content/browser.xul' % vars()),
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

