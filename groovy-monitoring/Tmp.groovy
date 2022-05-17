import sun.net.ftp.*
import groovy.json.*
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.List
import org.apache.http.client.HttpClient
import org.apache.http.client.methods.HttpPost
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.entity.StringEntity
import org.apache.http.entity.ContentType
import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.storelocator.model.confidentPointOfServiceModel;
import de.hybris.platform.storelocator.model.PointOfServiceModel;
import com.nosymag.www.nosymagInformationServerSchema.*

class CHECK {
    String host
    String libelle
    Integer resp
    String username
    String password
    Integer timeout
    String mode
    Integer port
    String text
}

class ENV {
    String eventType
    String name
    List SERVICES = []
}

class SERVICE {
    String label
    String status
    Boolean ok
    Long responsetime
    String ip
    String host

}

//Set Default Website confident.fr
def site = baseSiteService.getBaseSiteForUID("CLICKANDCOLLECT");
baseSiteService.setCurrentBaseSite(site, true)


def check1 = [host   : 'https://maxxing-ppr-intesrsportV2.ate.info/mpcm/web/api/ws/5.4/CustomerInformationServer.php?WSDL',
              text   : 'maxxing',
              libelle: "Maxxing Information WS"]

def check2 = [host   : 'https://maxxing-mes1-ppr-confidentV2.ate.info/mpcm/web/api/ws/5.4/StoreServer.php',
              text   : 'maxxing',
              libelle: "Maxxing Transaction  WS"]

def check3 = [host   : 'https://maxxing-mes2-ppr-confidentV2.ate.info/mpcm/web/api/ws/5.4/StoreServer.php',
              text   : 'maxxing',
              libelle: "Maxxing Transaction Backup WS"]

def checkcms = new CHECK(host: siteConfigService.getProperty("external.content.posts.URL"),
        text: 'total_posts_count',
        libelle: "CMS WP",
        resp: 200)

def checksapiban = new CHECK(host: siteConfigService.getProperty("sap.iban.soap.endpoint"),
        libelle: "SAP WS Iban",
        resp: 415,
        username: siteConfigService.getProperty("sap.iban.soap.username"),
        password: siteConfigService.getProperty("sap.iban.soap.password"),
        timeout: Integer.valueOf(siteConfigService.getProperty("sap.iban.soap.timeout")))


def checksapordercancel = new CHECK(host: siteConfigService.getProperty("sap.webservice.cancel.order.endpoint"),
        libelle: "SAP Order Cancel",
        resp: 415,
        username: siteConfigService.getProperty("sap.webservice.login"),
        password: siteConfigService.getProperty("sap.webservice.password"),
        timeout: Integer.valueOf(siteConfigService.getProperty("sap.webservice.timeout")))


def checksapordercreation = new CHECK(host: siteConfigService.getProperty("sap.webservice.create.order.endpoint"),
        libelle: "SAP Order Creation",
        resp: 415,
        username: siteConfigService.getProperty("sap.webservice.login"),
        password: siteConfigService.getProperty("sap.webservice.password"),
        timeout: Integer.valueOf(siteConfigService.getProperty("sap.webservice.timeout")))

def checksaporderstock = new CHECK(host: siteConfigService.getProperty("sap.webservice.stock.dispo.endpoint"),
        libelle: "SAP Order Stock",
        resp: 415,
        username: siteConfigService.getProperty("sap.webservice.login"),
        password: siteConfigService.getProperty("sap.webservice.password"),
        timeout: Integer.valueOf(siteConfigService.getProperty("sap.webservice.timeout")))

def checksapordermodif = new CHECK(host: siteConfigService.getProperty("sap.webservice.modif.order.endpoint"),
        libelle: "SAP Order Modif",
        resp: 415,
        username: siteConfigService.getProperty("sap.webservice.login"),
        password: siteConfigService.getProperty("sap.webservice.password"),
        timeout: Integer.valueOf(siteConfigService.getProperty("sap.webservice.timeout")))



def checkT2S = new CHECK(host: siteConfigService.getProperty("CLICKANDCOLLECT.target2sell.export.job.ftp.host"),
        libelle: "Target2sell FTP",
        mode: siteConfigService.getProperty("CLICKANDCOLLECT.target2sell.export.job.ftp.mode"),
        username: siteConfigService.getProperty("CLICKANDCOLLECT.target2sell.export.job.ftp.username"),
        password: siteConfigService.getProperty("CLICKANDCOLLECT.target2sell.export.job.ftp.password"),
        port: Integer.valueOf(siteConfigService.getProperty("CLICKANDCOLLECT.target2sell.export.job.ftp.port")),
        timeout: 1000)

def checkplio = new CHECK(host: siteConfigService.getProperty("splio.url.email"),
        libelle: "Splio Email",
        resp: 400,
        timeout: 1000)


def adyenws = new CHECK(host: siteConfigService.getProperty("integration.adyen.requestRecurringPaymentDetails.url"),
        libelle: "Adyen WS",
        resp: 200,
        username: site.getAdyenAPIAccount(),
        password: site.getAdyenAPIPassword(),
        timeout: 5000)

def adyenpayout = new CHECK(host: siteConfigService.getProperty("integration.adyen.requestRecurringPaymentDetails.url"),
        libelle: "Adyen Payout",
        resp: 200,
        username: site.getAdyenConfirmPayoutAccount(),
        password: site.getAdyenConfirmPayoutPassword(),
        timeout: 10000)

def adyenstorepayout = new CHECK(host: siteConfigService.getProperty("integration.adyen.requestRecurringPaymentDetails.url"),
        libelle: "Adyen Store",
        resp: 200,
        username: site.getAdyenSubmitPayoutAccount(),
        password: site.getAdyenSubmitPayoutPassword(),
        timeout: 5000)

def adyenreport = new CHECK(host: siteConfigService.getProperty("integration.adyen.requestRecurringPaymentDetails.url"),
        libelle: "Adyen Report",
        resp: 403,
        username: site.getAdyenReportAccount(),
        password: site.getAdyenReportPassword(),
        timeout: 5000)

def stores = new CHECK(host: 'stores',
        libelle: "Stores",
        mode: 'stores')

def maxxing = new CHECK(host: 'maxxing',
        libelle: "Maxxing Info",
        mode: 'maxxing',
        username: '1234567891234567')

def servers = [stores, adyenws, adyenpayout, adyenstorepayout, adyenreport, checkplio,
               checkT2S, checksapiban, checksapordercancel, checksapordercreation,
               checksaporderstock, checksapordermodif, checkcms, maxxing]

def environnement = siteConfigService.getProperty("environment.context.name").toUpperCase();
def environnement_type = environnement.equalsIgnoreCase("PREPROD")?"ws_available":"ws_available_".concat(siteConfigService.getProperty("environment.context.name").toLowerCase());

String[] productCodes = ['XXXXXXXXX']



ENV p = new ENV(name: environnement, eventType: environnement_type)

def koCount = 0
def checkout = { url, check ->

    def (available, sign, link, mode, port, usr, pass, timeout, respCode) = [false, url.text, url.host, url.mode ? url.mode : "http", url.port, url.username, url.password, url.timeout ? url.timeout : 5000, url.resp ? url.resp : 200];

    def start = System.currentTimeMillis()
    def end = System.currentTimeMillis()
    try {


        switch (mode.toLowerCase()) {
            case "ftp":
                def ftp = FtpClient.create()

                try {
                    ftp.setConnectTimeout(timeout)
                    ftp.connect(new InetSocketAddress(link, port ? port : FtpClient.defaultPort()));
                } catch (UnknownHostException e) {
                    throw e;
                } catch (FtpProtocolException fe) {
                    throw new IOException(fe);
                }
                try {

                    ftp.login(usr, pass.toCharArray())
                    ftp.close()
                    available = true

                } catch (sun.net.ftp.FtpProtocolException e) {
                    ftp.close();
                    throw new sun.net.ftp.FtpLoginException("Invalid username/password");
                }
                if (!available) {

                    koCount++
                }
                end = System.currentTimeMillis()
                p.SERVICES << new SERVICE(label: url.libelle, status: (available ? "OK" : "KO"), ok: (available ? 1 : 0), responsetime: (end - start), host: url.host)

                break
            case "maxxing":

                try {
                    available = true

                    Map<String, String> result = fidelityFacade.authentification(url.username, "");
                    if (result.get("errorCode") != null && !result.get("errorCode").isEmpty()) {
                        if ("unavailableService".equals(result.get("errorCode")))
                            available = false
                    }

                } catch (UnknownHostException e) {
                    throw e;
                } catch (Exception fe) {
                    throw new IOException(fe);
                }

                end = System.currentTimeMillis()
                p.SERVICES << new SERVICE(label: url.libelle, status: (available ? "OK" : "KO"), ok: (available ? 1 : 0), responsetime: (end - start), host: url.host)


                break

            case "stores":
                try {


                    SearchResult result = flexibleSearchService.search("SELECT {interPOS:pk} from {confidentPointOfService  as interPOS  } WHERE {latitude} is not null AND {longitude} is not null AND  ({interPOS:isClicknCollectStore} = true ) AND ({interPOS:adyenMerchantAccount} IS NOT NULL) AND ({interPOS:nosyMagDBIP} IS NOT NULL)");


                    Collection<PointOfServiceModel> listPOS = result.getResult();

                    def i = 0;

                    for (confidentPointOfServiceModel pos : listPOS) {
                        try {
                            available = false

                            start = System.currentTimeMillis()
                            resultMap = cartFacade.callNosymagForPrixStock(pos.getName(), productCodes, pos.getNosyMagDBIP(), false);
                            end = System.currentTimeMillis()
                            if (resultMap != null && resultMap.get("retourPrixStock") != null) {
                                available = true
                            }

                        } catch (Exception ex) {
                            available = false
                            koCount++
                        }
                        p.SERVICES << new SERVICE(label: pos.getName(), status: (available ? "OK" : "KO"), ok: (available ? 1 : 0), responsetime: (end - start) / resultMap.get("nbRetries"), ip: pos.getNosyMagDBIP(), host: url.host)


                    }


                } catch (Exception ex) {
                    koCount++

                }

                break
            default:
                def conn = link.toURL().openConnection()
                conn.setConnectTimeout(timeout);
                conn.setReadTimeout(timeout)

                if (usr && pass)
                    conn.setRequestProperty("Authorization", "Basic " + (usr + ":" + pass).getBytes().encodeBase64().toString() + "")


                if (conn.responseCode == respCode) {
                    available = true
                    if (sign && sign?.trim()) {
                        available = check(sign, conn.content.text)
                        if (!available) {
                            koCount++
                        }
                    }

                } else {
                    koCount++
                }
                end = System.currentTimeMillis()
                p.SERVICES << new SERVICE(label: url.libelle, status: (available ? "OK" : "KO"), ok: (available ? 1 : 0), responsetime: (end - start) < 5 ? 0 : (end - start), host: url.host)

                break
        }


    } catch (IOException ex) {
        if (ex instanceof UnknownHostException || ex instanceof ConnectException || ex instanceof SocketTimeoutException) {
            koCount++
        }
    }



}
def checkAll = { hosts, check -> hosts.each() { host -> checkout(host, check) } }

def contentCheck = { txt, content -> content.contains(txt) }


checkAll(servers, contentCheck)
def builder = new JsonBuilder(p.SERVICES.collect {
    SERVICE a -> [eventType: environnement_type, environnement: environnement, label: a.label, status: a.status, ok: a.ok, responsetime: a.responsetime, ip: a.ip, host: a.host]
})

//println builder.toPrettyString()

sendToNewrelic(builder)


def sendToNewrelic(def builder) {
    try {
        def url = "https://insights-collector.newrelic.com/v1/accounts/1232329/events";

        def client = new DefaultHttpClient();
        def post = new HttpPost(url)
        def json = builder.toPrettyString()

        StringEntity entity = new StringEntity(json,
                ContentType.APPLICATION_JSON);

        post.setEntity(entity);
        post.setHeader("Content-Type", 'application/json')
        post.setHeader("X-Insert-Key", 'gDiOJgcSQXBIHNP0eoLBaZdexGGxkJNI');


        def response = client.execute(post);

        println("Response Code : " + response.getStatusLine().getStatusCode());

        def rd = new BufferedReader(
                new InputStreamReader(response.getEntity().getContent()));

        def result = new StringBuffer();
        while ((line = rd.readLine()) != null) {
            result.append(line);
        }
        // println(result.toString());
    } catch (Exception exception) {
        println(exception)
        println "==> Request failed <==="

    }
}