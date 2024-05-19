//using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
//using System.Text;

//namespace tatarby.simulators.api.Controllers
//{
//    [ApiController]
//    [Route("wordsim")]
//    public class WordSimulatorController
//    {
//        private readonly HttpClient _httpClient;
//        private const string BaseUrl = "https://grammar.corpus.tatar/search/spellcheck.php";
//        public string Language { get; set; } = "tt";

//        public WordSimulatorController(HttpClient httpClient)
//        {
//            _httpClient = httpClient;
//        }

//        [HttpPost(nameof(CheckWord))]
//        public async Task<ActionResult<WordOutputDTO>> CheckWord([FromBody] WordInputDTO dto)
//        {
//            try
//            {
//                string responseContent = await MakeRequestAsync("spell", dto.InputText);
//                var apiResponse = JsonConvert.DeserializeObject<ApiResponseWord>(responseContent);

//                if (apiResponse == null || apiResponse.Word == null)
//                {
//                    return new WordOutputDTO(new List<string>() { "Ошибка при десериализации ответа." });
//                }

//                return new WordOutputDTO(apiResponse.Word);
//            }
//            catch (HttpRequestException ex)
//            {
//                return new WordOutputDTO(new List<string>() { "Ошибка при выполнении запроса к API." });
//            }
//        }

//        public async Task<string> MakeRequestAsync(string param, string text)
//        {
//            try
//            {
//                var content = new StringContent($"{param}={text}&lang={Language}", Encoding.UTF8, "application/x-www-form-urlencoded");
//                var response = await _httpClient.PostAsync(BaseUrl, content);

//                if (response.IsSuccessStatusCode)
//                {
//                    var responseText = await response.Content.ReadAsStringAsync();
//                    return ProcessResponse(param, responseText);
//                }
//                else
//                {
//                    return "Error!";
//                }
//            }
//            catch (Exception ex)
//            {
//                return $"Error: {ex.Message}";
//            }
//        }

//        private string ProcessResponse(string param, string jsonResponse)
//        {
//            var obj = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

//            if (param == "spell")
//            {
//                var modifiedText = obj.text.Replace("<HTML-SPECIAL-CHAR-([A-Za-z0-9#]+?)-HTML-SPECIAL-CHAR>", "&$1;");
//                return modifiedText;
//            }
//            else if (param == "add")
//            {
//                if (Language == "tt")
//                    return $"'{obj.text}' сүзе кабул ителде һәм тикшерелгәч, кулланыла башларга тиеш!";
//                else if (Language == "en")
//                    return $"Word '{obj.text}' has been received and will be verified before it takes effect!";
//                else
//                    return $"Слово '{obj.text}' получено и будет проверено, прежде чем начнет действовать!";
//            }
//            else
//            {
//                return "Invalid parameter value";
//            }
//        }

//        public class WordInputDTO
//        {
//            public string InputText { get; set; }
//        }

//        public class WordOutputDTO
//        {
//            public List<string> Result { get; set; }

//            public WordOutputDTO(List<string> result)
//            {
//                Result = result;
//            }
//        }

//        public class ApiResponseWord
//        {
//            [JsonProperty("word")]
//            public List<string> Word { get; set; }
//        }
//    }
//}