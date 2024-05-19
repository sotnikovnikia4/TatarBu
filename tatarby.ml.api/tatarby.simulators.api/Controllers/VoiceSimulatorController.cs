using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace tatarby.simulators.api.Controllers
{
    [ApiController]
    [Route("voicesim")]
    public class VoiceSimulatorController : ControllerBase
    {
        [HttpPost(nameof(CheckVoice))]
        public async Task<VoiceOutputDTO> CheckVoice([FromBody] VoiceInputDTO dto)
        {
            var wavBytes = Convert.FromBase64String(dto.Voice);
            using var wavContent = new ByteArrayContent(wavBytes);
            wavContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            using var client = new HttpClient();
            var response = await client.PostAsync("https://tat-asr.api.translate.tatar/listening/", new MultipartFormDataContent
            {
                { wavContent, "file", "voice.wav" }
            });

            response.EnsureSuccessStatusCode();
            var apiResponse = await response.Content.ReadAsStringAsync();
            var apiResult = Newtonsoft.Json.JsonConvert.DeserializeObject<ApiResponseVoice>(apiResponse);
            string outAiText;
            if (apiResult == null)
                outAiText = string.Empty;
            else
                outAiText = apiResult.text;

            string middleText = new string(dto.InputText.ToLower().Where(c => !char.IsPunctuation(c)).ToArray());

            var inputWords = middleText.Split(' ');
            var outAiWords = outAiText.Split(' ');
            var errors = inputWords.Except(outAiWords).ToList();

            double correctness = (double)(inputWords.Length - errors.Count) / inputWords.Length * 100;

            return new VoiceOutputDTO(correctness, errors);
        }
    }

    public class VoiceInputDTO
    {
        public string Voice { get; set; }

        public string InputText { get; set; }
    }

    public class VoiceOutputDTO
    {
        public double answerCorrectness { get; set; }

        public List<string> errors { get; set; }

        public VoiceOutputDTO(double aC, List<string> eList)
        {
            answerCorrectness = aC;
            errors = eList;
        }
    }

    public class ApiResponseVoice
    {
        public string text { get; set; }
    }
}