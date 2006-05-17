require 'net/http'
require 'yaml'
require File.dirname(__FILE__)+'/../app/overrides/date.rb'

class Moteur
    attr_reader :nom, :serveur, :url, :regexPos, :strDebutPage, :taillePage, :decalageDebut, :parPage
    
    def initialize(nom, serveur, url, regexPos, strDebutPage, taillePage, decalageDebut, parPage)
        @nom = nom
        @serveur = serveur
        @url = url
        @regexPos = regexPos
        @strDebutPage = strDebutPage
        @taillePage = taillePage
        @decalageDebut = decalageDebut
        @parPage = parPage
    end
    
    def cherchePositionPage(urlPage, site)
        strHtml = Net::HTTP.get_response(@serveur, urlPage).body
        resultats = strHtml.scan(Regexp.new(@regexPos))
        position = 0
        estTrouve = false
        resultats.each do |resultat|
            position = position + 1
            #~ print resultat[0]+"\n"
            estTrouve = resultat[0].include?(site)
            break if estTrouve
        end
        position = 0 if not estTrouve
        return position
    end
    
    def trouveRang(motsCles, site, rangMax)
        rang = 0
        numPage = 0
        estTrouve = false
        while rang < rangMax and not estTrouve
            urlPage = @url + urlize(motsCles)
            urlPage = urlPage + @strDebutPage
            if @parPage == 1
                urlPage = urlPage + (numPage + @decalageDebut).to_s
            else
                urlPage = urlPage + (rang+@decalageDebut).to_s
            end
            trouvePage = cherchePositionPage(urlPage, site)
            if trouvePage > 0
                rang = rang + trouvePage
                estTrouve = true
            else
                rang = rang + @taillePage
                numPage = numPage + 1
            end
        end
        rang = 0 if not estTrouve
        return rang
    end  
    
    def urlize(chaine)
        chaine.gsub!(/ /, "+")
        chaine.gsub!(/"/, "%22")
        return chaine
    end
end 

def draw_logo_wsb(pdf, pos_x = 0)
  pos_x = pdf.left_margin if pos_x==0
  pos_y = pdf.y - pdf.top_margin
  rond_rayon = 6
  pdf.select_font "Helvetica-Bold"
  #Le fond
  pdf.fill_color Color::RGB::Black
  pdf.rectangle(pos_x, pos_y , pdf.page_width - pdf.left_margin - pdf.right_margin, 8*rond_rayon).fill
  #Les quatres ronds
  pdf.fill_color Color::RGB::White
  rond_x = pos_x + rond_rayon + rond_rayon
  rond_y = pdf.y - 2*rond_rayon
  pdf.circle_at(rond_x, rond_y , rond_rayon).fill_stroke
  pdf.circle_at(rond_x, rond_y - 2*rond_rayon, rond_rayon).fill_stroke
  pdf.circle_at(rond_x + 2*rond_rayon, rond_y, rond_rayon).fill_stroke
  pdf.circle_at(rond_x + 2*rond_rayon, rond_y - 2*rond_rayon, rond_rayon).fill_stroke
  #Le texte
  pdf.fill_color Color::RGB::White
  pdf.add_text(rond_x +3*rond_rayon, rond_y -3*rond_rayon, "WS.", 32)
  pdf.fill_color Color::RGB::Red
  pdf.add_text(rond_x +3*rond_rayon + 60, rond_y -3*rond_rayon, "BURO", 32)
  pdf.move_pointer 4*rond_rayon
end

def affiche(tabResults)
    aujourdhui = DateTime.now.to_s[0..9]
    if $pdf
      fichierPdf = File.dirname(__FILE__)+"/../public/pdfs/"+tabResults[0]['compte']+"_"+aujourdhui+".pdf"
      #if File.exists?(fichierPdf)      
      #Préparation du pdf
      require "pdf/writer"
      require 'pdf/simpletable'
      pdf = PDF::Writer.new(:paper => "A4")
      #pdf.select_font "Times-Roman"
      draw_logo_wsb(pdf)
      pdf.select_font "Helvetica"
      pdf.fill_color Color::RGB::Black
      #~ pdf.text "Rapport de positionnement dans les moteurs de recherche.", :font_size => 18, :justification => :center      
    end
    
    compteCourant = ""
    dataTab = []
    tab = PDF::SimpleTable.new if $pdf
    for res in tabResults 
        if (compteCourant != res['compte'])
            compteCourant = res['compte']
            motsClesCourant = ""
            puts "\n"+res['compte']+" "+ aujourdhui if !$quiet
            if $pdf
              pdf.text " "
              pdf.text " "
              pdf.text res['compte'].upcase+" - "+ Time.now.strftime("%d %B %Y"), :font_size => 14, :justification => :left
              pdf.text " "
            end
        end
        if (motsClesCourant != res['motsCles'])
            motsClesCourant = res['motsCles']
            puts "  "+res['motsCles'] if !$quiet
            if $pdf
                #On ferme le tableau précédent s'il y en a un et on ouvre le suivant
                if dataTab.length > 0
                    tab.data.replace dataTab
                    tab.render_on(pdf)
                    #On passe une ligne
                    pdf.text "  "
                end
                tab = PDF::SimpleTable.new
                tab.title = res['motsCles']
                #~ tab.bold_headings = true
                tab.column_order.push(*%w(moteur url page position))
                tab.columns["moteur"] = PDF::SimpleTable::Column.new("moteur") { |col| col.heading = "Moteur de recherche"}
                tab.columns["url"] = PDF::SimpleTable::Column.new("url") { |col| col.heading = "Url"}
                tab.columns["page"] = PDF::SimpleTable::Column.new("page") { |col| col.heading = "Page"}
                tab.columns["position"] = PDF::SimpleTable::Column.new("position") { |col| col.heading = "Position"}
                tab.show_lines    = :all
                tab.show_headings = true
                tab.shade_headings = true
                tab.shade_rows = :none
                tab.orientation   = :right
                tab.position      = :left
                dataTab = []
            end
        end
        dataTab << {'moteur' => res['moteur'], 'url' => res['url'], 'page' => res['page'], 'position' => res['position']} if $pdf
        puts "    "+res['moteur']+" "+res['url']+" "+res['page']+" "+res['position'].to_s if !$quiet
    end
    
    if $pdf
        #Fermeture du dernier tableau
        if dataTab.length > 0
            tab.data.replace dataTab
            tab.render_on(pdf)
        end
        #Enregistrement du fichier PDF
        pdf.save_as(File.dirname(__FILE__)+"/../public/pdfs/"+res['compte']+"_"+aujourdhui+".pdf")
    end
end

def getposYaml
  tabResults = []

  #Utilisation de fichiers yaml
  listeMoteurs = YAML.load(File.open('moteurs.yml'))
  listeSites = YAML.load(File.open('sites.yml'))
  listeSites.each do |adresse, config|
      listeMotsCles = config['motsCles']
      posMax = config['posMax']
      config['moteurs'].each do |nomMoteur|
          moteurCfg = listeMoteurs[nomMoteur]
          moteur = Moteur.new(nomMoteur, moteurCfg['serveur'], moteurCfg['url'], moteurCfg['regexPos'], moteurCfg['strDebutPage'], moteurCfg['taillePage'].to_i, moteurCfg['decalageDebut'].to_i)
          listeMotsCles.each do |motsCles|	
            position = moteur.trouveRang(motsCles, adresse, posMax)
            page = position.to_i / moteur.taillePage.to_i + 1
            tabResults << {'compte' => adresse, 'motsCles' => motsCles, 'moteur' => moteur.nom, 'url' => adresse, 'page' => page.to_s, 'position' => position}
          end
      end
  end
  affiche(tabResults)
end

def getposMysql(args)
  tabResults = []

  #Utilisation de MySQL
  require 'mysql'
  require 'date'
  
  #Récupération de la config mysql de rails
  configRails = YAML.load(File.open(File.dirname(__FILE__)+'/database.yml'))
  configProduction = configRails['production']
  dbh = Mysql.real_connect('localhost', configProduction['username'], configProduction['password'], configProduction['database'])
  
  aujourdhui = DateTime.now.to_s[0..9]
  
  #Récupération de la liste des moteurs de recherche
  listeMoteurs = []
  res = dbh.query("SELECT * FROM moteurs")
  while row = res.fetch_hash do
    listeMoteurs[row["id"].to_i] = {
      "nom" => row['nom'],
      "url" => row['url'],
      "serveur" => row['serveur'],
      "regexPos" => row['regexPos'],
      "strDebutPage" => row['strDebutPage'],
      "taillePage" => row['taillePage'],
      "decalageDebut" => row['decalageDebut'],
      "parPage" => row['parPage']
    }
  end
  res.free
  
  sql = "SELECT sites.id AS site_id, site, motsCles, posMax, moteur_id, searches.id AS search_id, accounts.nom AS compte, logo FROM sites LEFT JOIN searches ON sites.id = searches.site_id LEFT JOIN accounts ON sites.account_id = accounts.id LEFT JOIN moteurs ON searches.moteur_id = moteurs.id"
  sql = sql + " WHERE sites.account_id="+args[0] if (args.length>0)
  res = dbh.query(sql)
  while rowSite = res.fetch_hash do
    dejaCalc = false
    unless $force
      #On regarde si la recherche a déjà été effectuée aujourd'hui. Si c'est le cas on récupère la position calculée
      resVerif = dbh.query("SELECT position FROM archives WHERE search_id="+rowSite['search_id']+" AND date='"+aujourdhui+"'")
      if tabPosition = resVerif.fetch_hash
        position = tabPosition['position']
        dejaCalc = true
      end
    end
    moteurCfg = listeMoteurs[rowSite['moteur_id'].to_i]
    moteur = Moteur.new(moteurCfg['nom'], moteurCfg['serveur'], moteurCfg['url'], moteurCfg['regexPos'], moteurCfg['strDebutPage'], moteurCfg['taillePage'].to_i, moteurCfg['decalageDebut'].to_i, moteurCfg['parPage'].to_i)
    if $force || !dejaCalc
        position = moteur.trouveRang(rowSite['motsCles'], rowSite['site'], rowSite['posMax'].to_i)
    end
    #Maj de la bdd 
    if $save && (!dejaCalc || $force)
      dbh.query("DELETE FROM archives WHERE date='"+aujourdhui+"' AND search_id="+rowSite['search_id']) if $force
      dbh.query("INSERT INTO archives (date, position, search_id) VALUES ('"+aujourdhui+"', "+position.to_s+", "+rowSite['search_id']+")")
    end
    if position == '0'
        position = "N/A"
        page = "N/A"
    else
        page = (position.to_i - 1) / moteur.taillePage.to_i + 1
    end
    tabResults << {'compte' => rowSite['compte'], 'motsCles' => rowSite['motsCles'], 'moteur' => moteur.nom, 'url' => rowSite['site'], 'page' => page.to_s, 'position' => position, 'logo' => rowSite['logo']}
  end
  res.free
  
  dbh.close
  affiche(tabResults)
end

#Gestion des options de ligne de commande
require 'rubygems'
require 'cmdparse'
cmd = CmdParse::CommandParser.new( true )
cmd.program_name = "wsb_position"
cmd.program_version = [1, 0, 0]
cmd.options = CmdParse::OptionParserWrapper.new do |opt|
  opt.separator "Global options:"
  opt.on("--quiet", "Don't output results on screen") {|t| $quiet = true }
  opt.on("--pdf", "Write results to a pdf") {|t| $pdf = true }
  opt.on("--usedb", "Use database source") {|t| $usedb = true }
  opt.on("--save", "Save results (in database)") {|t| $save = true }
  opt.on("--force", "Force execution even if it had been already done today") {|t| $force = true }
end
cmd.add_command( CmdParse::HelpCommand.new )
cmd.add_command( CmdParse::VersionCommand.new )

#dbpos
dbpos = CmdParse::Command.new( 'dbpos', false )
dbpos.short_desc = "Get url positions in search engines results - config from database"
dbpos.set_execution_block do |args|
  getposMysql(args)
end
cmd.add_command( dbpos)

# getpos
getpos = CmdParse::Command.new( 'getpos', false )
getpos.short_desc = "Get url positions in search engines results"
getpos.set_execution_block do |args|
  if $usedb
    getposMysql(args)
  else
    getposYaml
  end
end
cmd.add_command( getpos, true)

cmd.parse