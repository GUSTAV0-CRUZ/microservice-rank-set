export class CustomeseEmail {
  constructor(
    private readonly applicant: string,
    private readonly challenged: string,
  ) {}

  getSubjectCustomese() {
    return `Você foi desafiado no Rank-set!`;
  }

  getTextCustomese() {
    return `
        Você foi desafiado no Rank-set!

      Olá ${this.applicant},

      Você recebeu um novo desafio de ${this.applicant}.

      Acesse a plataforma para aceitar ou recusar o desafio.

      Boa sorte e bom jogo!

      Equipe Rank-set
    `;
  }

  getHtmlCustomese() {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #111827; color: #ffffff; text-align: center; padding: 20px;">
              <h1 style="margin: 0;">Rank-set</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; color: #333333;">
              <h2 style="margin-top: 0;">${this.challenged} você foi desafiado! 🎯</h2>
              
              <p>
                o jogador ${this.applicant} acabou de te desafiar em uma nova partida.
              </p>

              <p>
                Acesse a plataforma para aceitar ou recusar o desafio.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://seu-app.com"
                  style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Ver desafio
                </a>
              </div>

              <p>
                Boa sorte e bom jogo! 🚀
              </p>

              <p style="margin-top: 30px; font-size: 12px; color: #888;">
                Equipe Rank-set
              </p>
            </td>
          </tr>

        </table>
      </div>
    `;
  }
}
