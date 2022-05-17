@Grab('org.codehaus.groovy.modules.http-builder:http-builder:0.7')


import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.storelocator.model.confidentPointOfServiceModel;
import de.hybris.platform.storelocator.model.PointOfServiceModel;

String[] productCodes = ['XXXXXXXXX'];

import com.nosymag.www.nosymagInformationServerSchema.*

try {


    SearchResult result = flexibleSearchService.search("SELECT {interPOS:pk} from {confidentPointOfService  as interPOS  } WHERE {latitude} is not null AND {longitude} is not null AND  ({interPOS:isClicknCollectStore} = true ) AND ({interPOS:adyenMerchantAccount} IS NOT NULL) AND ({interPOS:nosyMagDBIP} IS NOT NULL)");


    Collection<PointOfServiceModel> listPOS = result.getResult();

    def i = 0;
    for (confidentPointOfServiceModel pos : listPOS) {
        def start = System.currentTimeMillis()
        resultMap = cartFacade.callNosymagForPrixStock(pos.getName(), productCodes, pos.getNosyMagDBIP(), false);
        def end = System.currentTimeMillis()
        println "- Response Time = " + (end - start) / resultMap.get("nbRetries") + " ms"
        if (resultMap != null && resultMap.get("retourPrixStock") != null) {
            println "OK"
        }
        i++;
        if (i == 10)
            break;
    }



} catch (Exception ex) {
    println "KO"

}