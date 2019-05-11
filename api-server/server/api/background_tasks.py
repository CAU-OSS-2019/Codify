import uuid
import os
from background_task import background
from api.models import Source
from .compile_settings import *

# Background Compile Task
@background
def activate_compile():
    waits = Source.objects.filter(result=3) # get all waiting submissions

    for submit in waits:
        try:
            # generate source file name
            while True:
                id = str(uuid.uuid4())
                file_path = os.path.abspath(os.path.join(CODE_SAVE_DIRECTORY, id))
                stdout_path = os.path.abspath(os.path.join(CODE_SAVE_DIRECTORY, id + ".stdout"))
                stderr_path = os.path.abspath(os.path.join(CODE_SAVE_DIRECTORY, id + ".stderr"))
                if os.path.exists(file_path) or os.path.exists(stdout_path) or os.path.exists(stderr_path):
                    # generate new name if already exists
                    pass
                else:
                    break

            # write source file
            with open(file_path, "w", encoding="utf-8") as code_file:
                code_file.write(submit.code)

            # execute compile script
            if submit.lang == "c":
                exec_path = os.path.join(COMPILE_DOCKER_DIRECTORY, "c", "exec.sh")
            else:
                raise ValueError("Not Supported Language")
            result = os.system("%s %s %s %s" % (exec_path, file_path, stdout_path, stderr_path))

            try:
                os.remove(file_path)
            except Exception as e:
                print(str(e))

            # os.system return value
            # 0 : compile success
            # other : error
            if result == 0:
                submit.status = 1 # OK
                using_output = stdout_path # output is stdout (console output)
            else:
                submit.status = 2 # FAIL
                using_output = stderr_path # output is error description

            with open(using_output, "r", encoding="utf-8") as f:
                submit.output = f.read()

            # save compile result
            submit.save()

        except Exception as e:
            # if exception, go to next submission
            print(str(e))
            continue
