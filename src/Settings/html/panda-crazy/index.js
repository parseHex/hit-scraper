import addJobButtons from "./add-job-buttons";
import pauseWithQueue from "./pause-with-queue";

export default function () {
	return `
		<p style="margin-left:15px">
			<b>
				<a href="https://greasyfork.org/en/scripts/19168-jr-mturk-panda-crazy" target="_blank">
					Panda Crazy
				</a> &nbsp;
				must be running for these options to work!
			</b>
		</p>
		${addJobButtons.apply(this.user)}
		${pauseWithQueue.apply(this.user)}
	`;
}
