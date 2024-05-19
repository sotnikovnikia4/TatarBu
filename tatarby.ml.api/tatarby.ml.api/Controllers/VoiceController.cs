using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;


namespace tatarby.ml.api.Controllers
{
	[ApiController]
	[Route("voice")]
	public class VoiceController : ControllerBase
	{
		private readonly ILogger<VoiceController> _logger;

		public VoiceController(ILogger<VoiceController> logger)
		{
			_logger = logger;
		}

		[HttpPost(nameof(CheckVoice))]
		public async Task<CheckVoiceOutputDTO> CheckVoice([FromBody] CheckVoiceInputDTO dto)
		{
			_logger.LogInformation("Received input: {InputText}, Voice data length: {VoiceLength}", dto.InputText, dto.Voice.Length);
			if (dto.InputText == string.Empty)
			{
				return new CheckVoiceOutputDTO(0, null);
			}
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
			var apiResult = Newtonsoft.Json.JsonConvert.DeserializeObject<ApiResponse>(apiResponse);
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

			return new CheckVoiceOutputDTO(correctness, errors);
		}
	}

	public class CheckVoiceInputDTO
	{
		[JsonProperty("voice")]
		public string Voice { get; set; }

		[JsonProperty("input_text")]
		public string InputText { get; set; }
	}

	public class CheckVoiceOutputDTO
	{
		[JsonProperty("answer_correctness")]
		public double answerCorrectness { get; set; }

		public List<string> errors { get; set; }

		public CheckVoiceOutputDTO(double aC, List<string> eList)
		{
			answerCorrectness = aC;
			errors = eList;
		}
	}

	public class ApiResponse
	{
		public string text { get; set; }
	}
}