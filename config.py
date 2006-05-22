#!/usr/bin/env python

app = 'goldorank'
name = 'Goldorank'
description = 'Search engines position retriever by WebSiteBuro'
author = 'Henri Bourcereau'
authorURL = "http://www.websiteburo.com"
uid = 'e4b43b01-1ccb-476a-92d2-9a193ad4ff50'

major_version = 0
minor_version = 5
build_version = 4
in_development = False

version = "%d.%d.%d%s" % (
    major_version,
    minor_version,
    build_version,
    in_development and "+" or ""

)

homepageURL = "http://www.websiteburo.com/%(app)s" % vars()
updateURL = "%(homepageURL)s/update.rdf" % vars()
updateFile = "%(app)s-%(version)s.xpi" % vars()
updateLink = "%(homepageURL)s/%(updateFile)s" % vars()
firefoxUID = 'ec8030f7-c20a-464f-9b0e-13a3a9e97384'
firefoxMinVersion = '1.5'
firefoxMaxVersion = '1.9'

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

